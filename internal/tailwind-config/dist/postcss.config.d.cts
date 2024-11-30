import * as tailwindcss_types_config from 'tailwindcss/types/config';

declare const _default: {
    plugins: {
        autoprefixer: {};
        'postcss-antd-fixes': {
            prefixes: string[];
        };
        'postcss-import': {};
        'postcss-preset-env': {};
        tailwindcss: {
            config: tailwindcss_types_config.Config;
        };
        'tailwindcss/nesting': {};
        cssnano?: {} | undefined;
    };
};

export { _default as default };
