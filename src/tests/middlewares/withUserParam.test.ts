import NotFoundError from '@Errors/NotFoundError'
import { withUserParamFactory } from '@Middlewares/withUserParam'

import userFactory from '../factories/userFactory'

describe('withUserParam', () => {
  it('calls next when user exists', async () => {
    const user = userFactory()
    const mockErrorCallback = jest.fn()
    const mockRepository: any = {
      findById: jest.fn().mockResolvedValue(user)
    }
    const withUserParam = withUserParamFactory(mockErrorCallback, mockRepository)
    const mockRequest: any = {}
    const mockResponse: any = {}
    const mockNext = jest.fn()

    await withUserParam(mockRequest, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRequest.user).toMatchObject(user)
    expect(mockErrorCallback).not.toHaveBeenCalled()
  })

  it('calls errorCallback when has an error', async () => {
    const error = new Error('Example error')
    const mockErrorCallback = jest.fn()
    const mockRepository: any = {
      findById: jest.fn().mockRejectedValue(error)
    }
    const withUserParam = withUserParamFactory(mockErrorCallback, mockRepository)
    const mockRequest: any = {}
    const mockResponse: any = {}
    const mockNext = jest.fn()

    await withUserParam(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockErrorCallback).toHaveBeenCalledWith(mockResponse, error)
  })

  it('calls errorCallback when user does not exist', async () => {
    const mockErrorCallback = jest.fn()
    const mockRepository: any = {
      findById: jest.fn().mockResolvedValue(undefined)
    }
    const withUserParam = withUserParamFactory(mockErrorCallback, mockRepository)
    const mockRequest: any = {}
    const mockResponse: any = {}
    const mockNext = jest.fn()

    await withUserParam(mockRequest, mockResponse, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockErrorCallback).toHaveBeenCalledWith(mockResponse, new NotFoundError().getError())
  })
})
