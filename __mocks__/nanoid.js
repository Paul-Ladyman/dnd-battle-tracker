const nanoIdMock = jest.fn().mockReturnValue('random-battle-id');
module.exports = {
  nanoid: nanoIdMock,
};
