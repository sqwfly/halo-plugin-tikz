# halo-plugin-tikz

TikZ 插件，实现 TikZ 代码（实际是 LaTex 代码，只不过以 TikZ 宏包为特色，兼容部分其它 LaTex 宏包）在 **默认编辑器** 与文章页的渲染，**TikZ** 是一个基于 LaTeX 的强大绘图宏包，全称为“TikZ ist kein Zeichenprogramm”，意为“TikZ 不是一个绘图程序”。它允许用户通过编写代码来创建高质量的矢量图形，能够将数学公式、物理概念和算法流程转化为 **精美** 的图形。TikZ 的设计理念是用编程的方式描述图形，提供了精确控制和无限扩展的能力，使得用户可以绘制从简单的点线到复杂的数学图形的各种图形。

## 效果预览

![](https://www.sqwfly.top/upload/plugin_tikz_20260123204536.avif)

## 下载方式

1. Halo 应用市场 [TikZ](https://www.halo.run/store/apps)
2. GitHub Releases：访问 [Releases](https://github.com/sqwfly/halo-plugin-tikz/releases) 下载 Assets 中的 JAR 文件

## 使用方式

1. 在默认编辑器的菜单栏中点击 **+** 插入 **TikZ 编辑块**

   ![](https://www.sqwfly.top/upload/plugin_tikz_20260123202640.avif)

2. 在默认编辑器中点击左侧的菜单按钮 **+** 插入 **TikZ 编辑块**

   ![](https://www.sqwfly.top/upload/plugin_tikz_20260123202821.avif)

## 使用建议与指南

1. 你可以浏览 [TikZ 官网](https://tikz.dev/) 来学习 TikZ 语法和使用方法，如果你对 TikZ 语法不是很熟悉，可以浏览此网站提供的海量模板 [TikZ Templates](https://texample.net/)，不过该网站提供的大部分模板不能直接使用因为它们用到了本插件所依赖的核心库中部分不可获取的宏包，需要尽心一定的修改

2. 配置 TikZ 后端渲染api，后端 TikZ 服务的部署参考我的 [**仓库**](https://github.com/sqwfly/tikz-express) ，或点击 [**Deploy with Vercel**](https://vercel.com/new/git/external?repository-url=https://github.com/sqwfly/tikz-express&project-name=tikz-express&repository-name=tikz-express) 进行部署，使用者需要自己部署，只需要一个 [Vercel](https://vercel.com/) 账号（默认拥有 Github 账号）和一个域名（因为Vercel提供的默认域名在大陆不可访问)，后续我会将自己的api设置为禁止跨域，禁止他人使用

   ![](https://www.sqwfly.top/upload/plugin_tikz_20260123204809.avif)

3. 使用前需要先 `\usepackage{}` 导入对应宏包，并使用 `\begin{document}` 和 `\end{document}` 进行包裹，如下为示例：

   函数表达式
   $$
   \frac{\sin\left(\sqrt{x^2+y^2}\right)}{\sqrt{x^2+y^2}}
   $$

   TikZ 代码
   ```latex
   \usepackage{pgfplots}
   \begin{document}
   \begin{tikzpicture}
   \begin{axis}[
       title=3D function example,
       hide axis,
       colormap/cool,
   ]
   \addplot3[
       mesh,
       samples=50,
       domain=-20:20,
   ]
   {sin(deg(sqrt(x^2+y^2)))/sqrt(x^2+y^2)};
   \addlegendentry{$\frac{sin(r)}{r}$}
   \end{axis}
   \end{tikzpicture}
   \end{document}
   ```

4. 可导入的 LaTex 宏包

   ```latex
   % 默认导入的内容
   \documentclass[margin=0pt]{standalone}
   \def\pgfsysdriver{pgfsys-ximera.def}
   \usepackage{tikz}
   
   % 其它默认导入的 LaTex 宏包（可通过后端服务调整）
   \usepackage{pgfplots} % 用于创建高质量的二维和三维图表
   \usepackage[intlimits]{amsmath} % 强大的数学公式宏包，提供了丰富的数学符号和公式排版功能，intlimits表示：无论行内还是显示公式，上下标都放在运算符的上方和下方
   
   % 其它可以导入的 LaTex 宏包
   \usepackage{array} % 可以实现复杂的表格排版
   \usepackage{amsmath} % 强大的数学公式宏包，提供了丰富的数学符号和公式排版功能
   \usepackage{amstext} % 提供了在公式中输入文本的\text 命令
   \usepackage{amsfonts} % amsfonts 宏包以及基于它的 amssymb 宏包提供了丰富的数学符号
   \usepackage{amssymb}
   
   % 其它可以导入的依赖 TikZ 的LaTex 宏包
   \usepackage{chemfig} % 用于绘制化学结构和反应式
   \usepackage{tikz-cd} % 用于绘制交换图
   \usepackage{circuitikz} % 用于绘制电路图
   \usepackage{tikz-3dplot} % 提供了定义三维坐标系和绘制简单三维图形的功能
   
   % 默认导入的 TikZ 库（可通过后端服务调整）
   \usetikzlibrary{arrows.meta,calc}
   ```

5. 删除时双击标题栏选中 TikZ 编辑块，然后删除，或者点击左侧的菜单按钮进行删除

   ![](https://www.sqwfly.top/upload/plugin_tikz_20260123204716.avif)

## 注意事项

1. 不支持中文字符，一些空行可能会导致渲染失败，$\Omega$ 和 $\otimes$ 会被渲染为：¬，应当避免使用这两个符号
3. 本插件通过后端部署的 TikZ 服务渲染 TikZ 代码，需要先将 TikZ 代码编译渲染为 DVI 格式文件，然后再将其渲染为 SVG 图片，所以整个过程需要一定的时间，这取决于渲染图形的复杂程度以及后端服务的能力，不过默认编辑器只要拿到渲染的结果，主题端会直接加载其渲染结果，无需主题端二次渲染，对于访客来言是无感的

## 与 Typst 编辑块插件有什么不同？

1. TikZ 编辑块，是以 LaTex 中的 TikZ 宏包为核心，专注于绘图的插件，不是完整的 Tex 环境，目前该插件不支持中文，Typst 编辑块则提供了几乎完整的Typst环境，还可以通过配置中文字体来呈现中文。LaTex 宏包 TikZ 与 Typst 包 CeTZ 相近，由此可见 Typst 编辑块功能更强大，但是相应的加载的资源也会多一些，你可以根据自己熟悉的语法和需要的功能选择相应插件
2. TikZ 出现的更早，所以由其衍生的宏包会更多一些，整个生态更加完善，学习资源和模板更加丰富，此即为先发优势，如果仅仅是用于绘图，则推荐该插件

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目，希望更多贡献者可以参与进来使该插件从能用到好用

所需环境：

1. Java 21+

2. Node 20+

3. pnpm 10+

4. Docker (可选)

克隆项目进行开发，开发流程参考：[插件开发指南](https://docs.halo.run/category/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)

```bash
git clone git@github.com:sqwfly/halo-plugin-tikz.git

# 或者当你 fork 之后
git clone git@github.com:{your_github_id}/halo-plugin-tikz.git
```

## 致谢

- [node-tikzjax](https://github.com/prinsss/node-tikzjax)：本插件后端渲染依赖的核心库，感谢该项目的贡献者

## 许可证

本项目基于 GPL-3.0 许可证开源 - 查看 [LICENSE](https://github.com/Einstein-schrodinger/halo-plugin-tikz/blob/main/LICENSE) 文件了解详情
