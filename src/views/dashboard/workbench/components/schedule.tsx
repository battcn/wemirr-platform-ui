export default function ({ calendarValue }) {
  return {
    crudOptions: {
      form: {
        initialForm: {
          date: calendarValue,
        },
        wrapper: { title: "增加日程", width: "45%" },
        doSubmit({ form }: any) {
          console.log("form", form);
          // return {};
        },
        afterSubmit(ctx: any) {
          console.info("form after submit:", ctx);
          // return true;
        },
      },
      columns: {
        time: {
          title: "时间",
          type: "time",
          form: {
            labelCol: { span: 6 },
            rules: [{ required: true, message: "时间不能为空" }],
          },
        },
        desc: {
          title: "日程描述",
          type: ["textarea"],
          form: {
            labelCol: { span: 3 },
            col: { span: 24 },
            rules: [{ required: true, message: "日程描述不能为空" }],
            helper: {
              position: "label",
              tooltip: {
                placement: "topLeft",
              },
              text: "详细填写描述信息,便于不会忘记今天的任务~~~",
            },
          },
        },
      },
    },
  };
}
