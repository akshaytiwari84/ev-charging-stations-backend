import { AuthService } from "../service/auth.service";
import { Request, Response } from "express";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import {
  LoginInDto,
  RegisterInDto,
} from "../model/authInDto";
import { LoginOutDto } from "../model/authOutDto";
import { User, UserRole } from "../../../common/entity/user/user.entity";
import { AuthToken } from "../utils/auth.token";

@Service()
export class AuthController {
  constructor(
    public authService: AuthService,
    public authToken: AuthToken
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as LoginInDto;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user: User | null = await this.authService.getUserByFields({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found with this email" });
      }

      // Use bcrypt compare since that's what the User entity uses
      if (!(await user.validatePassword(password))) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password" });
      }

      const token = this.authToken.generateToken(user.id, user.role, user.email);

      const responseData: LoginOutDto = {
        id: user.id,
        name: user.name,
        role: user.role,
        token,
      };

      return res.json(responseData);
    } catch (error: any) {
      return res.status(500).json({ message: error?.message });
    }
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, role, password } = req.body as RegisterInDto;
      
      // Check if email already exists
      const isEmail: User | null = await this.authService.getUserByFields({
        email,
      });
      
      if (isEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Set the role with validation
      let userRole = role as UserRole;
      if (!Object.values(UserRole).includes(userRole)) {
        userRole = UserRole.USER; // Default to USER if invalid role
      }

      // Register the user
      const newUser = await this.authService.register({
        name,
        email,
        password: hash,
        role: userRole
      });

      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });
    } catch (error: any) {
      return res.status(500).json({ message: error?.message });
    }
  }
}