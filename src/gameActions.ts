export const processUserCommand = (
  command: string,
  setGameOutput: (updateFn: (prevGameOutput: string[]) => string[]) => void
) => {
  const lowerCaseCommand = command.toLowerCase();

  switch (lowerCaseCommand) {
    case 'go north':
      // Logic for moving north
      setGameOutput((prevGameOutput) => [...prevGameOutput, 'You move north.']);
      break;
    case 'go south':
      // Logic for moving south
      setGameOutput((prevGameOutput) => [...prevGameOutput, 'You move south.']);
      break;
    case 'pick up item':
      // Logic for picking up an item
      setGameOutput((prevGameOutput) => [...prevGameOutput, 'You pick up the item.']);
      break;
    default:
      setGameOutput((prevGameOutput) => [...prevGameOutput, 'Unknown command.']);
  }
};