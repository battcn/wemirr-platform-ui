import { defHttp } from '/@/utils/http/axios';
import { FastCrud, setLogger } from '@fast-crud/fast-crud';
import '@fast-crud/fast-crud/dist/style.css';
import { FsExtendsEditor, FsExtendsUploader } from '@fast-crud/fast-extends';
import '@fast-crud/fast-extends/dist/style.css';
import UiAntdv from '@fast-crud/ui-antdv';
import { useCrudPermission } from '/@/plugin/permission/use-crud-permission';

// 导出 setupFastCrud
// 国际化配置见 /src/locales/en  or zh_CN
export default function (app, i18n) {
  //先安装ui
  app.use(UiAntdv);
  setLogger({ level: 'warn' });
  //再安装fast-crud
  app.use(FastCrud, {
    i18n,
    async dictRequest({ url }) {
      return await defHttp.request({ url });
    },
    commonOptions(context) {
      const opts = {
        toolbar: {
          // toolbar.buttons.export.show:false 显示隐藏
          // toolbar.compact:false 默认选择
          compact: false,
        },
        actionbar: {
          buttons: {
            add: {
              icon: 'akar-icons:circle-plus',
            },
          },
        },
        rowHandle: {
          width: 130,
          align: 'center',
          // 固定右侧 不建议设置成全局
          // fixed: 'right',
          buttons: {
            view: { size: 'small', type: 'link', text: null, icon: 'akar-icons:search' },
            edit: { size: 'small', type: 'link', text: null, icon: 'ion:create-outline' },
            remove: { size: 'small', type: 'link', text: null, icon: 'ion:trash-outline' },
          },
          dropdown: {
            more: {
              type: 'link',
            },
          },
        },
        table: {
          size: 'small',
          scroll: {
            //需要设置它，否则滚动条拖动时，表头不会动
            fixed: false,
          },
          pagination: false,
        },
        request: {
          transformQuery: ({ page, form, sort }) => {
            const order = sort == null ? {} : { column: sort.prop, asc: sort.asc };
            return { current: page.currentPage, size: page.pageSize, ...form, ...order };
          },
          transformRes: ({ res }) => {
            return { currentPage: res.current, pageSize: res.size, ...res };
          },
        },
        form: {
          display: 'flex',
          wrapper: {
            is: 'a-drawer',
          },
        },
      };
      const crudPermission = useCrudPermission(context);
      return crudPermission.merge(opts);
    },
  });

  app.use(FsExtendsEditor);
  //配置uploader 公共参数
  app.use(FsExtendsUploader, {
    defaultType: 'cos',
    cos: {
      domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
      bucket: 'd2p-demo-1251260344',
      region: 'ap-guangzhou',
      secretId: '', //
      secretKey: '', // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
      async getAuthorization() {
        // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return await defHttp.request(
          {
            url: '/upload/cos/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' }
        );
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      },
    },
    alioss: {
      domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
      bucket: 'd2p-demo',
      region: 'oss-cn-shenzhen',
      accessKeyId: '',
      accessKeySecret: '',
      async getAuthorization() {
        // 不传accessKeySecret代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return defHttp.request(
          {
            url: '/upload/alioss/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' }
        );
      },
      sdkOpts: {
        // sdk配置
        secure: true, // 默认为非https上传,为了安全，设置为true
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      },
    },
    qiniu: {
      bucket: 'd2p-demo',
      async getToken() {
        // return  {token:xxx,expires:xxx}
        return defHttp.request(
          {
            url: '/upload/qiniu/getToken',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' }
        );
      },
      successHandle(ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      },
      domain: 'http://d2p.file.veryreader.com',
    },
    form: {
      action: 'http://www.docmirror.cn:7070/api/upload/form/upload',
      name: 'file',
      withCredentials: false,
      successHandle(ret) {
        console.log('ret ==> ', ret);
        // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
        if (!ret.data) {
          throw new Error('上传失败');
        }
        return {
          url: ret.data,
        };
      },
    },
  });
}
