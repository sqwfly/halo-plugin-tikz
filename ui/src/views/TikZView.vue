<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import IcOutlineFullscreen from '~icons/ic/outline-fullscreen'
import IcOutlineFullscreenExit from '~icons/ic/outline-fullscreen-exit'
import IcOutlineTipsAndUpdates from '~icons/ic/outline-tips-and-updates'
import TikZRenderer from '@/components/TikZRenderer.vue'

const props = defineProps(nodeViewProps)
const fullscreen = ref(false)
const collapsed = ref(false)
const minHeight = ref(120) // 3-5行的高度（约120px）
const currentHeight = ref(minHeight.value)
const isEditing = ref(false)

// TikZ editor
function onEditorChange(value: string) {
  try {
    props.updateAttributes({ content: value })
    // 编辑时动态调整高度
    adjustHeightByContent(value)
  } catch (error) {
    console.error('Failed to update TikZ content:', error)
  }
}

// 根据内容动态调整高度
function adjustHeightByContent(content: string) {
  if (collapsed.value || fullscreen.value) return

  if (!content) {
    // 内容为空时恢复到最小高度
    currentHeight.value = minHeight.value
    return
  }

  const lines = content.split('\n').length
  const estimatedHeight = Math.max(minHeight.value, lines * 24) // 每行约24px
  const maxHeight = 400 // 最大高度限制
  currentHeight.value = Math.min(estimatedHeight, maxHeight)
}

// 监听折叠状态变化
watch(collapsed, (newCollapsed) => {
  if (!newCollapsed && !fullscreen.value) {
    // 展开时重新计算高度
    const content = props.node.attrs.content || ''
    if (content) {
      adjustHeightByContent(content)
    }
  }
})

// 监听全屏状态变化
watch(fullscreen, (newFullscreen) => {
  if (newFullscreen) {
    // 进入全屏时自动展开
    collapsed.value = false
  } else if (!collapsed.value) {
    // 退出全屏时重新计算高度
    const content = props.node.attrs.content || ''
    if (content) {
      adjustHeightByContent(content)
    }
  }
})

// 监听编辑器焦点事件
function onEditorFocus() {
  isEditing.value = true
}

function onEditorBlur() {
  isEditing.value = false
  // 如果不在编辑状态且内容较少，恢复到最小高度
  const content = props.node.attrs.content || ''
  if (content.split('\n').length <= 5) {
    currentHeight.value = minHeight.value
  }
}

onMounted(() => {
  // 添加ESC键退出全屏的监听
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && fullscreen.value) {
      fullscreen.value = false
      event.preventDefault()
      event.stopPropagation()
    }
  }

  document.addEventListener('keydown', handleKeydown, true)

  // 清理函数
  const cleanup = () => {
    document.removeEventListener('keydown', handleKeydown, true)
  }

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    cleanup()
  })

  watch(
    () => props.node.attrs.content,
    (newContent) => {
      // 初始化时调整高度
      if (newContent && !collapsed.value && !fullscreen.value) {
        adjustHeightByContent(newContent)
      }
    },
  )
  // 初始化高度
  const initialContent = props.node.attrs.content || ''
  if (initialContent && !collapsed.value && !fullscreen.value) {
    adjustHeightByContent(initialContent)
  }
})
</script>
<template>
  <node-view-wrapper class="tikz-container" :class="{ 'tikz-fullscreen': fullscreen }">
    <div class="tikz-nav">
      <div class="tikz-nav-start">
        <div>TikZ 编辑块</div>
        <a v-tooltip="`查阅 TikZ 的文档`" href="https://tikz.dev/" target="_blank">
          <IcOutlineTipsAndUpdates />
        </a>
      </div>
      <div class="tikz-nav-end">
        <div v-if="!fullscreen" class="tikz-collapse-icon" @click="collapsed = !collapsed">
          <svg
            v-if="collapsed"
            v-tooltip="'展开'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <svg
            v-else
            v-tooltip="'折叠'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
        <div class="tikz-fullscreen-icon" @click="fullscreen = !fullscreen">
          <IcOutlineFullscreenExit v-if="fullscreen" v-tooltip="'退出全屏'" />
          <IcOutlineFullscreen v-else v-tooltip="'全屏'" />
        </div>
      </div>
    </div>
    <div v-if="collapsed && !fullscreen" class="tikz-collapsed-hint">
      <span>TikZ 编辑块已折叠</span>
    </div>
    <div
      class="tikz-editor-panel"
      :class="{ 'tikz-collapsed': collapsed && !fullscreen }"
      :style="{
        height: collapsed && !fullscreen ? '0px' : fullscreen ? '100%' : currentHeight + 'px',
      }"
    >
      <div class="tikz-code">
        <VCodemirror
          :model-value="props.node.attrs.content || ''"
          height="100%"
          language="yaml"
          @change="onEditorChange"
          @focus="onEditorFocus"
          @blur="onEditorBlur"
        />
      </div>
      <div class="tikz-preview" contenteditable="false">
        <TikZRenderer v-bind="props" auto-render />
      </div>
    </div>
  </node-view-wrapper>
</template>
<style>
.tikz-container {
  border: 1px #e7e7e7 solid;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.75em;
}

.tikz-nav {
  border-bottom: 1px #e7e7e7 solid;
  display: flex;
  padding: 5px 10px;
  align-items: center;
}

.tikz-nav-start {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.tikz-nav-end {
  justify-content: flex-end;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tikz-editor-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  transition: height 0.3s ease;
  overflow: hidden;
}

.tikz-editor-panel.tikz-collapsed {
  height: 0px !important;
}

.tikz-code {
  height: 100%;
  border-right: 1px #e7e7e7 solid;
}

.tikz-preview {
  user-select: none;
  padding: 5px;
  height: 100%;
  overflow: auto;
}

.tikz-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-top: 0;
  display: flex;
  flex-direction: column;
}

.tikz-fullscreen .tikz-nav {
  flex-shrink: 0;
}

.tikz-fullscreen .tikz-editor-panel {
  flex: 1;
  height: auto !important;
  min-height: 0;
}

.tikz-fullscreen-icon {
  cursor: pointer;
}

.tikz-fullscreen-icon svg {
  font-size: 18px;
}

.tikz-collapse-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.tikz-collapse-icon:hover {
  background-color: #f5f5f5;
  color: #666;
}

.tikz-collapse-icon svg {
  font-size: 14px;
}

.tikz-collapsed-hint {
  padding: 8px 10px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #6c757d;
  text-align: center;
}

.tikz-fullscreen-icon:hover {
  color: #999;
}

/* 确保代码区和预览区在所有模式下都能独立滚动 */
.tikz-code {
  overflow-y: auto;
  overflow-x: hidden;
}

.tikz-preview {
  overflow: auto;
}

/* 全屏模式下的额外样式 */
.tikz-fullscreen .tikz-editor-panel {
  overflow: hidden;
}

/* 确保标题栏在全屏时始终可见 */
.tikz-fullscreen .tikz-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
}
</style>
