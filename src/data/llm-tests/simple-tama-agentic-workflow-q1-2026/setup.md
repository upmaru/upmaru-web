The setup for the agent tests the following capability of the AI agents:

- Routing - Can the model route the user message to the correct execution path?
- Tool Use - Does it call tools accurately with valid structured arguments?
- Instruction Following - Can it follow instructions in the system prompt correctly?
- Resolving Constraints - Does it understand how to resolve constraints provided in the user's query?
- Multi-turn Conversation - Can the model handle multi-turn conversation and still do all of the above correctly?

If the model fails to do any of the above, the workflow will fail. We will dig in to see what the model outputs to find the gaps. We will also compare our results against the results on Artificial Analysis to verify whether the scores reflect the capabilities outlined in these tests.

Given the simplicity of this test, models benchmarked with high scores should be able to pass it without any issues.
