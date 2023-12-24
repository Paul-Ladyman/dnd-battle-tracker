import {
  addCondition,
  removeCondition,
} from './ConditionsManager';
import getSecondsElapsed from './TimeManager';

jest.mock('./TimeManager');

const blinded = 'Blinded';
const blindedUrl = 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Blinded';
const blindedText = 'Blinded';
const blindedId = 'blinded-0';
const round = 1;

beforeEach(() => {
  jest.resetAllMocks();
  getSecondsElapsed.mockReturnValue(0);
});

describe('addCondition', () => {
  it('adds a condition to an empty list', () => {
    const creature = {
      conditions: [],
      id: 0,
    };
    const result = addCondition(blinded, creature, round);
    const expectedConditions = [{
      text: blindedText,
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: blindedUrl,
      id: blindedId,
    }];
    expect(result).toEqual(expectedConditions);
    expect(getSecondsElapsed).toHaveBeenCalledTimes(1);
    expect(getSecondsElapsed).toHaveBeenCalledWith(round);
  });

  it('adds a condition to a list of existing conditions', () => {
    const condition = {
      text: 'some condition',
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: 'some url',
      id: 'condition-0',
    };
    const creature = {
      conditions: [condition],
      id: 0,
    };
    const result = addCondition(blinded, creature, round);
    const expectedConditions = [
      condition,
      {
        text: blindedText,
        appliedAtRound: round,
        appliedAtSeconds: 0,
        url: blindedUrl,
        id: blindedId,
      },
    ];
    expect(result).toEqual(expectedConditions);
    expect(getSecondsElapsed).toHaveBeenCalledTimes(1);
    expect(getSecondsElapsed).toHaveBeenCalledWith(round);
  });

  it('does not add a condition if it already exists', () => {
    const condition = {
      text: blindedText,
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: blindedUrl,
      id: blindedId,
    };
    const creature = {
      conditions: [condition],
      id: 0,
    };
    const result = addCondition(blinded, creature, round);
    expect(result).toEqual(creature.conditions);
    expect(getSecondsElapsed).not.toHaveBeenCalled();
  });

  it('does not add an unknown condition', () => {
    const creature = {
      conditions: [],
      id: 0,
    };
    const result = addCondition('Unknown', creature, round);
    expect(result).toEqual(creature.conditions);
    expect(getSecondsElapsed).not.toHaveBeenCalled();
  });
});

describe('removeCondition', () => {
  it('removes an existing condition', () => {
    const condition = {
      text: blindedText,
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: blindedUrl,
      id: blindedId,
    };
    const anotherCondition = {
      text: 'some condition',
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: 'some url',
      id: 'condition-0',
    };
    const creature = {
      conditions: [condition, anotherCondition],
      id: 0,
    };
    const result = removeCondition(blinded, creature);
    expect(result).toEqual([anotherCondition]);
  });

  it('does nothing if the condition does not exist', () => {
    const condition = {
      text: blindedText,
      appliedAtRound: round,
      appliedAtSeconds: 0,
      url: blindedUrl,
      id: blindedId,
    };
    const creature = {
      conditions: [condition],
      id: 0,
    };
    const result = removeCondition('Unknown', creature);
    expect(result).toEqual(creature.conditions);
  });
});
