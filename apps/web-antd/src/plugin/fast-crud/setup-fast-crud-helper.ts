export function formColumnToFastCrud(columnList: string[]) {
  const columns: Record<string, any> = {};

  columnList.forEach((col) => {
    columns[col] = {
      title: col,
      type: 'text',
      column: {
        width: 200,
        ellipsis: true,
        show: true,
        resizable: true,
        order: 10,
      },
      form: { show: false },
    };
  });

  return {
    columns,
  };
}
