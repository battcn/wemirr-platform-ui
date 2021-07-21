import { FormSchema } from '/@/components/Form';

export const formSchema: FormSchema[] = [
  {
    field: 'originalPassword',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
    componentProps: {
      autocomplete: 'off',
      placeholder: '请输入当前密码',
    },
  },
  {
    field: 'password',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      autocomplete: 'off',
      placeholder: '请输入新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'off',
      placeholder: '请输入确认密码',
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
