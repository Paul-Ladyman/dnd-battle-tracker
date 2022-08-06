export const mockGetId = jest.fn().mockResolvedValue({
  IdentityId: 'identity-id',
});

export const mockGetCredentialsForIdentity = jest.fn().mockResolvedValue({
  Credentials: {
    AccessKeyId: 'access-key-id',
    Expiration: new Date(),
    SecretKey: 'secret-key',
    SessionToken: 'session-token',
  },
});

export const CognitoIdentity = jest.fn().mockImplementation(() => ({
  getId: mockGetId,
  getCredentialsForIdentity: mockGetCredentialsForIdentity,
}));
