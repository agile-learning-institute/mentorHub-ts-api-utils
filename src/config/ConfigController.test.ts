import { ConfigController } from './ConfigController';
import { Request, Response } from 'express';

const mockRequest = (options = {}): Partial<Request> => ({
  ...options,
});

const mockResponse = (): Partial<Response> & { json: jest.Mock } => {
  const res: any = {};
  res.send = jest.fn().mockReturnThis();
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis(); 
  return res as Partial<Response> & { json: jest.Mock };
};

describe('ConfigController', () => {
  let cfgController: ConfigController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    cfgController = new ConfigController();
    req = {};
    res = mockResponse();
  });

  test('getConfig should properly modify response', () => {
    const req = mockRequest();
    const res = mockResponse();

    cfgController.getConfig(req as Request, res as Response);

    // Assert on the first argument of the first call to res.json
    const jsonResponse = res.json.mock.calls[0][0];
    expect(jsonResponse).toHaveProperty('configItems');
    expect(jsonResponse).toHaveProperty('versions');
    expect(jsonResponse).toHaveProperty('enumerators');
  });
});
