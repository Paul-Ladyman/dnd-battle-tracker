function oneHourFromNow() {
  const date = new Date();
  date.setTime(date.getTime() + 60 * 60 * 1000);
  return date;
}

export const mockGetId = jest.fn().mockResolvedValue({
  IdentityId: 'identity-id',
});

export const mockGetCredentialsForIdentity = jest.fn().mockResolvedValue({
  Credentials: {
    AccessKeyId: 'access-key-id',
    Expiration: oneHourFromNow(),
    SecretKey: 'secret-key',
    SessionToken: 'session-token',
  },
});

export const CognitoIdentity = jest.fn().mockImplementation(() => ({
  getId: mockGetId,
  getCredentialsForIdentity: mockGetCredentialsForIdentity,
}));
