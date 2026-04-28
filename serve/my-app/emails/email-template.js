export function EmailTemplate({ firstName, otp }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>欢迎，${firstName}!</h1>
      <p>感谢您的注册，请使用下方验证码完成注册流程：</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        此验证码 10 分钟内有效。如非本人操作，请忽略此邮件。
      </p>
    </div>
  `;
}
