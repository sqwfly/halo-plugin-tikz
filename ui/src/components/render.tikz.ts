import { getTikZRenderApi } from '@/utils'

export const renderTikZ = async (
  content: string,
  onRenderingStart?: () => void,
  onRenderingComplete?: () => void
): Promise<string> => {
  if (!content?.trim()) {
    return '<p style="color: #999; font-style: italic;">请输入 TikZ 代码</p>'
  }
  try {
    // 通知开始渲染
    onRenderingStart?.()
    const tikzRenderApi = await getTikZRenderApi()
    const response = await fetch(tikzRenderApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: content })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    // 获取 SVG
    const svg = await response.text()
    return svg
  } catch (err) {
    console.error('TikZ 渲染错误:', err)
    return `
      <div class="tikz-render-error">
        <h4>TikZ 渲染错误</h4>
        <p>${err instanceof Error ? err.message : '未知错误'}</p>
        <p>请检查代码语法是否正确。</p>
      </div>
    `
  } finally {
    // 通知渲染完成（无论成功或失败）
    onRenderingComplete?.()
  }
}
