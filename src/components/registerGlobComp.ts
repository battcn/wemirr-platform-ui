import type { App } from 'vue';
// import { Icon } from './Icon';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
  Input,
  InputNumber,
  Card,
  Image,
  Select,
  Radio,
  Steps,
  Skeleton,
  Empty,
  Collapse,
  Dropdown,
  Row,
  Col,
  Alert,
  Checkbox,
  Tag,
  Tabs,
  Spin,
  Form,
  Affix,
  Tooltip,
  Descriptions,
  Badge,
  Layout,
  Avatar,
  DatePicker,
  Menu,
  Modal,
  Divider,
} from 'ant-design-vue';

const compList = [AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app
    .use(Input)
    .use(Steps)
    .use(Button)
    .use(Layout)
    .use(Image)
    .use(Card)
    .use(InputNumber)
    .use(Form)
    .use(Empty)
    .use(Col)
    .use(Checkbox)
    .use(Collapse)
    .use(Row)
    .use(Alert)
    .use(Tabs)
    .use(Menu)
    .use(Dropdown)
    .use(Radio)
    .use(Badge)
    .use(Select)
    .use(Tag)
    .use(DatePicker)
    .use(Skeleton)
    .use(Tooltip)
    .use(Divider)
    .use(Affix)
    .use(Modal)
    .use(Spin)
    .use(Descriptions)
    .use(Avatar);
}
