import { z } from 'zod'

export const registerCodeSchema = z.object({
  registerCode: z.string().min(1, '注册码不能为空'),
})

export const sendOtpSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  code: z.string().min(1, '注册码不能为空'),
})

export const checkOtpSchema = z.object({
  code: z.string().min(1),
  email: z.string().email('邮箱格式不正确'),
  otp: z.string().length(6, '验证码为6位数字'),
  password: z.string().min(8, '密码至少8位'),
  username: z.string().min(2, '用户名至少2位').max(16, '用户名最多16位'),
  qq: z.string().regex(/^\d{5,11}$/, 'QQ号为5-11位数字'),
})

export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

export function validate(schema, data, c) {
  const result = schema.safeParse(data)
  if (!result.success) {
    return c.json(
      {
        success: false,
        error: '输入校验失败',
        details: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
      400,
    )
  }
  return null
}
