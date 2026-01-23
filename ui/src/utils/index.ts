import { consoleApiClient } from '@halo-dev/api-client'

const pluginName = 'plugin-tikz'

// 获取插件配置中的 tikzRenderApi
export const getTikZRenderApi = async (): Promise<string> => {
  try {
    const response = await consoleApiClient.plugin.plugin.fetchPluginJsonConfig({ name: pluginName })
    // 从返回的配置中获取 tikzRenderApi
    // response.data 是一个对象，包含所有配置项分组
    // 实际数据结构: { "basic": { "tikzRenderApi": "...", ... } }
    const data = response.data as { basic?: { tikzRenderApi?: string } }
    return data?.basic?.tikzRenderApi || ''
  } catch (error) {
    console.error('获取 tikzRenderApi 失败:', error)
    return ''
  }
}
