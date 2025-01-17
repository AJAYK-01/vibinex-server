import type { NextApiRequest, NextApiResponse } from 'next';
import { isRepoIdentifier, type RepoIdentifier } from '../../types/repository';
import { setRepoConfig } from '../../utils/db/repos';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import rudderStackEvents from "./events";
import { getAuthUserName } from '../../utils/auth';

type SetRepoConfigReqBody = {
	repo: RepoIdentifier,
	configType: 'auto_assign' | 'comment',
	value: boolean
}

const isSetRepoConfigReqBody = (x: any): x is SetRepoConfigReqBody => {
	return x && isRepoIdentifier(x.repo) && (x.configType === "auto_assign" || x.configType === "comment") && typeof x.value === "boolean";
}

const setRepoConfigHandler = async (
	req: NextApiRequest,
	res: NextApiResponse<{ message: string }>
) => {
	// check auth
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthenticated' });
	}

	// validate request
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'setRepoConfig API must be called using POST method' });
	}
	if (!isSetRepoConfigReqBody(req.body)) {
		return res.status(400).json({ message: 'setRepoConfig API received invalid values for one or more of its fields' })
	}

	// update repo config
	const { repo, configType, value }: SetRepoConfigReqBody = req.body;
	const eventProperties = {
		...repo,
		configType,
		updatedValue: value
	}
	await setRepoConfig(repo, configType, value)
		.then((queryResponse) => {
			if (queryResponse) {
				rudderStackEvents.track(session.user.id!, "", 'settings-changed', { type: 'setting', eventStatusFlag: 1, name: getAuthUserName(session), eventProperties })
				res.status(200).json({ message: 'success' });
			}
			else
				throw new Error('Failed to modify repository configuration');
		})
		.catch((err) => {
			rudderStackEvents.track(session.user.id!, "", 'settings-changed', { type: 'setting', eventStatusFlag: 0, name: getAuthUserName(session), eventProperties })
			console.error(`[setRepoConfig] Failed to update config for ${repo.repo_provider}/${repo.repo_owner}/${repo.repo_name}`, err);
			res.status(500).json({ message: 'Internal error: Could not update repository configuration.' })
		})
}

export default setRepoConfigHandler;