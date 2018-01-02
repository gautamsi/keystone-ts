import * as React from 'React';
import * as tinymce from 'tinymce';
import { FormInput } from 'elemental';
import { evalDependsOn } from '../../utils/evalDependsOn';
import { FieldBase, FieldPropsBase } from '../Field';

/**
 * TODO:
 * - Remove dependency on underscore
 */

let lastId = 0;

function getId() {
    return 'keystone-html-' + lastId++;
}

// Workaround for #2834 found here https://github.com/tinymce/tinymce/issues/794#issuecomment-203701329
function removeTinyMCEInstance(editor) {
    let oldLength = tinymce.editors.length;
    tinymce.remove(editor);
    if (oldLength === tinymce.editors.length) {
        tinymce.editors.remove(editor);
    }
}

interface Props extends FieldPropsBase {
    wysiwyg?: any;
    height?: any;
}
export class HtmlField extends FieldBase<Props> {
    _currentValue: any;
    editor: any;

    static displayName: string = 'HtmlField';
    static type: string = 'Html';

    constructor(props) {
        super(props);
        this.state = {
            id: getId(),
            isFocused: false,
            wysiwygActive: false,
            ...this.state
        };
    }

    initWysiwyg() {
        if (!this.props.wysiwyg) return;

        let opts: any = this.getOptions();

        opts.setup = (editor) => {
            this.editor = editor;
            editor.on('change', this.valueChanged);
            editor.on('focus', this.focusChanged.bind(this, true));
            editor.on('blur', this.focusChanged.bind(this, false));
        };

        this._currentValue = this.props.value;
        tinymce.init(opts);
        if (evalDependsOn(this.props.dependsOn, this.props.values)) {
            this.setState({ wysiwygActive: true });
        }
    }

    removeWysiwyg(state) {
        removeTinyMCEInstance(tinymce.get(state.id));
        this.setState({ wysiwygActive: false });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isCollapsed && !this.state.isCollapsed) {
            this.initWysiwyg();
        }

        if (this.props.wysiwyg) {
            if (evalDependsOn(this.props.dependsOn, this.props.values)) {
                if (!this.state.wysiwygActive) {
                    this.initWysiwyg();
                }
            } else if (this.state.wysiwygActive) {
                this.removeWysiwyg(prevState);
            }
        }
    }

    componentDidMount() {
        this.initWysiwyg();
    }

    componentWillReceiveProps(nextProps) {
        if (this.editor && this._currentValue !== nextProps.value) {
            this.editor.setContent(nextProps.value);
        }
    }

    focusChanged(focused) {
        this.setState({
            isFocused: focused,
        });
    }

    valueChanged(event) {
        let content;
        if (this.editor) {
            content = this.editor.getContent();
        } else {
            content = event.target.value;
        }

        this._currentValue = content;
        this.props.onChange({
            path: this.props.path,
            value: content,
        });
    }

    getOptions() {
        let plugins = ['code', 'link'];
        let options = Object.assign(
            {},
            Keystone.wysiwyg.options,
            this.props.wysiwyg
        );
        let toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
        let i;

        if (options.enableImages) {
            plugins.push('image');
            toolbar += ' | image';
        }

        if (options.enableCloudinaryUploads || options.enableS3Uploads) {
            plugins.push('uploadimage');
            toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
        }

        if (options.additionalButtons) {
            let additionalButtons = options.additionalButtons.split(',');
            for (i = 0; i < additionalButtons.length; i++) {
                toolbar += (' | ' + additionalButtons[i]);
            }
        }
        if (options.additionalPlugins) {
            let additionalPlugins = options.additionalPlugins.split(',');
            for (i = 0; i < additionalPlugins.length; i++) {
                plugins.push(additionalPlugins[i]);
            }
        }
        if (options.importcss) {
            plugins.push('importcss');
            let importcssOptions = {
                content_css: options.importcss,
                importcss_append: true,
                importcss_merge_classes: true,
            };

            Object.assign(options.additionalOptions, importcssOptions);
        }

        if (!options.overrideToolbar) {
            toolbar += ' | code';
        }

        let opts = {
            selector: '#' + this.state.id,
            toolbar: toolbar,
            plugins: plugins,
            menubar: options.menubar || false,
            skin: options.skin || 'keystone',
            uploadimage_form_url: undefined
        };

        if (this.shouldRenderField()) {
            opts.uploadimage_form_url = options.enableS3Uploads ? Keystone.adminPath + '/api/s3/upload' : Keystone.adminPath + '/api/cloudinary/upload';
        } else {
            Object.assign(opts, {
                mode: 'textareas',
                readonly: true,
                menubar: false,
                toolbar: 'code',
                statusbar: false,
            });
        }

        if (options.additionalOptions) {
            Object.assign(opts, options.additionalOptions);
        }

        return opts;
    }

    renderField() {
        let className = this.state.isFocused ? 'is-focused' : '';
        let style = {
            height: this.props.height,
        };
        return (
            <div className={className}>
                <FormInput
                    id={this.state.id}
                    multiline
                    name={this.getInputName(this.props.path)}
                    onChange={this.valueChanged}
                    className={this.props.wysiwyg ? 'wysiwyg' : 'code'}
                    style={style}
                    value={this.props.value}
                />
            </div>
        );
    }

    renderValue() {
        return (
            <FormInput multiline noedit>
                {this.props.value}
            </FormInput>
        );
    }
}
