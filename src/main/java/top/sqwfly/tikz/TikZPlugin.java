package top.sqwfly.tikz;

import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

@Component
public class TikZPlugin extends BasePlugin {
    public TikZPlugin(PluginContext pluginContext) {
        super(pluginContext);
    }
}
