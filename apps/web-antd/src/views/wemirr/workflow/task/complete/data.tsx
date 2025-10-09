export interface WidgetFormItem {
  model?: string;
  type?: string;
  options: {
    defaultValue?: any;
    remoteOptions?: any;
  };
  isLayout?: boolean;
  list?: WidgetFormItem[];
}

export interface ApprovalStep {
  taskName: string;
  remark: string;
  attachments: string[];
  approverTime: string;
  approverName: string;
  taskStatus: string;
  procInstStatus: string;
}
export const setJsonIntoFrom = (
  list: undefined | WidgetFormItem[],
  dataJson: Record<string, any>,
): undefined | WidgetFormItem[] => {
  if (!list) {
    return;
  }

  // Helper function to update the default value
  const updateItem = (item: WidgetFormItem, value: any) => {
    if (item.type === 'table') {
      item.options.remoteOptions = value;
    } else {
      item.options.defaultValue = value;
    }
  };

  // Recursive function to handle nested lists
  const processList = (items: WidgetFormItem[]) => {
    items.forEach((item) => {
      const value = dataJson[item.model ?? ''];
      if (value !== undefined) {
        updateItem(item, value);
      } else if (item.isLayout && item.list) {
        processList(item.list); // Recursive call for nested lists
      }
    });
  };

  // Start processing the main list
  processList(list);

  return list;
};
