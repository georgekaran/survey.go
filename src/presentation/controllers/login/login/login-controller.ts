import { Controller, HttpRequest, HttpResponse, Authentication } from './login-protocols-controller'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/controllers/login/signup/signup-protocols-controller'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken: 'any_token' })
    } catch (error) {
      return serverError(error)
    }
  }
}
