import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async activate(@Body() big: number): Promise<boolean> {
    return this.authService.activate(big);
  }
}
