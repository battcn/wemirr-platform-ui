import { BasicColumn } from "@/components/Table/src/types/table";

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: "资源吗",
      dataIndex: "permission",
      width: 150,
    },
    {
      title: "名称",
      width: 150,
      dataIndex: "label",
    },
  ];
}
