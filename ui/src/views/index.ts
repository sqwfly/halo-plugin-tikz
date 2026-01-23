import {
  type Editor,
  mergeAttributes,
  Node,
  type Range,
  VueNodeViewRenderer,
  ToolboxItem,
  type ExtensionOptions,
} from '@halo-dev/richtext-editor'
import { markRaw } from 'vue'
import icon from '~icons/file-icons/latex'
import TikZView from './TikZView.vue'

export const ExtensionTikZ = Node.create<ExtensionOptions>({
  name: 'tikz',
  inline: false,
  group: 'block',
  code: true,
  atom: true,

  addAttributes() {
    return {
      content: {
        default:
          '',
        parseHTML(element) {
          if (element.hasAttribute('content')) {
            return element.getAttribute('content') || ''
          }
          return null
        },
      },
      svg: {
        default: null,
        rendered: false,
        parseHTML(element) {
          if (!element.firstElementChild) {
            return null
          }
          if (element.firstElementChild.tagName === 'svg') {
            return element.firstElementChild.outerHTML
          }
          return null
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'tikz[data-type="tikz"]',
      },
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    const svg = node.attrs.svg
    if (svg) {
      const tikz = document.createElement('tikz')
      tikz.setAttribute('data-type', 'tikz')
      tikz.setAttribute('content', node.attrs.content)
      tikz.innerHTML = svg
      return { dom: tikz }
    }
    return [
      'tikz[data-type="tikz"]',
      mergeAttributes({
        ...HTMLAttributes,
      }),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(TikZView)
  },
  addOptions() {
    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 100,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(icon),
              title: 'TikZ 编辑块',
              action: () => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: 'tikz',
                  })
                  .run()
              },
            },
          },
        ]
      },
      getCommandMenuItems() {
        return {
          priority: 100,
          icon: markRaw(icon),
          title: 'TikZ 编辑块',
          keywords: ['tikz'],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent({
                type: 'tikz',
              })
              .run()
          },
        }
      },
    }
  },
})
