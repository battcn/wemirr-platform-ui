import { CreateCrudOptionsProps, CreateCrudOptionsRet, utils } from "@fast-crud/fast-crud";
import { changePassword } from "@/api/sys/user";
import { useMessage } from "@/hooks/web/useMessage";

export default function ({}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { notification } = useMessage();

  return {
    crudOptions: {
      form: {
        wrapper: {
          width: "600px",
          onClosed(e) {
            utils.logger.info("onClosed", e);
          },
          onOpened(e) {
            utils.logger.log("onOpened", e);
          },
        },
        doSubmit({ form }: any) {
          //覆盖提交方法
          return changePassword(form)
            .then(() => {
              notification.success({ message: "修改成功", duration: 3 });
            })
            .catch((err) => {
              return { successful: false, message: err.message };
            });
        },
        afterSubmit(ctx: any) {
          if (ctx.res?.successful === false) {
            return false;
          }
        },
      },
      columns: {
        currentPassword: {
          title: "旧密码",
          type: "password",
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: "旧密码不能为空" }],
            helper: "请输入原密码",
          },
        },
        newPassword: {
          title: "新密码",
          type: "password",
          form: {
            col: { span: 24 },
            rules: [
              { required: true, message: "旧密码不能为空" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "密码至少8个字符，并且包含大写字母、小写字母、数字和特殊字符。",
              },
            ],
            helper: "请输入原密码",
          },
        },
        confirmPassword: {
          title: "确认密码",
          type: "password",
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: "确认密码不能为空" }],
          },
        },
      },
    },
  };
}
