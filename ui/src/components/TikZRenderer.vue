<template>
  <div class="tikz-preview-container">
    <!-- 渲染结果 -->
    <div v-if="isRendering" class="tikz-preview-content">
      <div class="tikz-render-rendering">
        <h4>TikZ 尝试渲染中...</h4>
        <p>请耐心等待，很快就好...</p>
      </div>
    </div>
    <div v-else class="tikz-preview-content">
      <div v-html="rendered"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type NodeViewProps } from '@halo-dev/richtext-editor'
import { ref, onMounted, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { renderTikZ } from './render.tikz.ts'

const props = defineProps<NodeViewProps & { autoRender: boolean }>()
const content = computed<string>(() => props.node.attrs.content)
const rendered = computed<string>({
  get() {
    return props.node.attrs.svg
  },
  set(value) {
    props.updateAttributes({ svg: value })
  },
})
const isRendering = ref<boolean>(false)

// 创建防抖渲染函数
const debouncedRender = useDebounceFn(async (content: string) => {
  try {
    rendered.value = await renderTikZ(
      content,
      () => { isRendering.value = true },
      () => { isRendering.value = false }
    )
  } catch (error) {
    console.error('TikZ 渲染失败:', error)
    // 错误已在renderTikZ中处理，这里不需要额外处理
    isRendering.value = false
  }
}, 300)

onMounted(async () => {
  if (rendered.value) {
    return
  }
  if (props.autoRender && content.value) {
    await debouncedRender(content.value)
  }
})

// 监听内容变化
watch(
  () => content.value,
  async (newVal) => {
    if (props.autoRender) {
      await debouncedRender(newVal)
    }
  },
  {
    immediate: false,
  },
)

// 监听 autoRender 变化
watch(
  () => props.autoRender,
  (newVal) => {
    if (newVal && content.value) {
      debouncedRender(content.value)
    }
  },
)
</script>

<style scoped>
.tikz-preview-container {
  position: relative;
  width: 100%;
  min-height: 100px;
}

.tikz-preview-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.tikz-preview-content svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
<style>
/* 渲染错误样式 */
.tikz-preview-content .tikz-render-error {
  padding: 20px;
  border: 1px solid #ffcccc;
  background: #fff5f5;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.tikz-preview-content .tikz-render-error h4 {
  color: #d32f2f;
  margin-top: 0;
  margin-bottom: 10px;
}

.tikz-preview-content .tikz-render-error p {
  margin: 5px 0;
  color: #666;
}

/* 正在渲染中样式 */
.tikz-preview-content .tikz-render-rendering {
  padding: 20px;
  border: 1px solid #cdccff;
  background: #f5f5ff;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.tikz-preview-content .tikz-render-rendering h4 {
  color: #632fd3;
  margin-top: 0;
  margin-bottom: 10px;
}

.tikz-preview-content .tikz-render-rendering p {
  margin: 5px 0;
  color: #666;
}
</style>
