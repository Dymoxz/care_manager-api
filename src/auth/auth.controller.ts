import { Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':big')
  async activate(@Param('big') big: string): Promise<any> {
    return this.authService.activate(big); // Pass it to the service
  }

}
