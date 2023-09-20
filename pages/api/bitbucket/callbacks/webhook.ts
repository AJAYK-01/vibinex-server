import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonBody = req.body;
  const owner = jsonBody.repository.owner.username; 
  const provider = "bitbucket";
  const name = jsonBody.repository.name;
  const topicName = await getTopicNameFromDB(owner, name, provider);

  getRepoConfig({
    repo_provider: provider,
    repo_owner: owner,
    repo_name: name
  })
  .then((repoConfig) => {
    const data = {
      repositoryProvider: 'bitbucket',
      eventPayload: jsonBody,
      repoConfig: repoConfig
    };
    
    const msgType = 'webhook_callback';
    
    console.info("Received bitbucket webhook event for ", name);
    console.debug(`data = ${JSON.stringify(jsonBody)}`)
    console.debug(`topicname = ${topicName}`)
    console.debug(`repoConfig = ${JSON.stringify(repoConfig)}`)
    
    return publishMessage(topicName, data, msgType);
  })
  .then(() => {
    console.info("Sending message to pubsub for ", name);
    res.status(200);
    res.send("Success");
  })
  .catch((error) => {
    console.error('Failed to get repoConfig from db :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

export default webhookHandler;