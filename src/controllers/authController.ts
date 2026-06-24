import { Request, Response } from "express"
import { IUser, UserModel, UserRole } from "../models/userModel"
import bcrypt from "bcryptjs"
import { saveUser } from "../service/userService"
import { signAccessToken, signRefreshToken } from "../utils/token"
import { AuthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

// only role User
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    // service
    // saveUser({ email, name, password })

    const exUser = await UserModel.findOne({ email })
    if (exUser) {
      return res.status(400).json({ message: "User already exists..!" })
    }

    // bcrypt
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      approved: true
      // roles: [UserRole.ADMIN]
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      message: "User registration successfully..!",
      // data: { ...savedUser, password: null }
      data: {
        name: savedUser.name,
        email: savedUser.email,
        roles: savedUser.roles,
        approved: savedUser.approved,
        id: savedUser._id
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error while creating user..!"
    })
  }
}

// api/v1/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user: IUser | null = await UserModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }

    const isValid = await bcrypt.compare(password, user?.password)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)

    res.status(200).json({
      message: "Success",
      data: {
        email: user?.email,
        roles: user?.roles,
        accessToken,
        refreshToken
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error while login..!"
    })
  }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: "Unauthorized" })
  }
  const user = await UserModel.findById(req.user.sub).select("-password")

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { email, roles, _id } = user

  res.status(200).json({ message: "ok", data: { id: _id, email, roles } })
}

export const refreshToken = async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body
  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Token required..!" })
    }
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    const userId = payload.sub
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(403).json({ message: "Invalid or expire token" })
    }
    const newAccessToken = signAccessToken(user)
    res.status(200).json({
      message: "",
      data: { accessToken: newAccessToken }
    })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" })
  }
}
