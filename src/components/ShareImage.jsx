/**
 * ShareImage 组件 - 分享图片生成组件
 * 用于生成可分享的"实惠小贴士"图片
 */

import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

/**
 * 分享图片生成组件
 * @param {Object} props - 组件属性
 * @param {Array} props.rankings - 排序后的商品排名数据
 * @param {string} props.selectedUnit - 选中的计量单位
 * @param {string} props.selectedCategory - 选中的商品类别
 * @param {Function} props.onClose - 关闭回调
 */
const ShareImage = ({ rankings, selectedUnit, selectedCategory, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const templateRef = useRef(null)

  /**
   * 生成分享图片
   */
  const generateImage = async () => {
    if (!templateRef.current) {
      console.error('模板引用不存在')
      return
    }

    try {
      setIsGenerating(true)
      
      // 等待一小段时间确保DOM完全渲染
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 使用html2canvas生成图片 - 微信朋友圈最佳规格 3:4 比例
      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: '#7c3aed', // 设置背景色
        scale: 2, // 高清图片
        useCORS: true,
        allowTaint: false,
        height: 480,
        width: 360,
        scrollX: 0,
        scrollY: 0,
        logging: false, // 关闭日志减少干扰
        onclone: (clonedDoc) => {
          // 确保克隆的文档中包含所有样式
          const clonedElement = clonedDoc.querySelector('[data-share-template]')
          if (clonedElement) {
            clonedElement.style.transform = 'none'
            clonedElement.style.position = 'static'
          }
        }
      })

      // 转换为图片数据
      const imageDataUrl = canvas.toDataURL('image/png', 0.9)
      setGeneratedImage(imageDataUrl)
      
    } catch (error) {
      console.error('生成图片失败:', error)
      alert('生成图片失败，请重试。错误信息：' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * 下载图片 - 增强移动端支持
   */
  const downloadImage = async () => {
    if (!generatedImage) return

    try {
      // 移动端优先尝试触发下载
      const link = document.createElement('a')
      const fileName = `实惠小贴士-${new Date().toLocaleDateString().replace(/\//g, '-')}.png`
      
      link.download = fileName
      link.href = generatedImage
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 给用户明确的提示
      setTimeout(() => {
        alert('图片已触发下载！\n\n移动端用户请：\n1. 长按下方预览图片\n2. 选择"保存到相册"或"保存图片"\n\n这是移动端浏览器的限制，需要用户手动操作保存。')
      }, 500)
      
    } catch (error) {
      console.error('下载失败:', error)
      alert('自动下载失败，请长按图片手动保存')
    }
  }

  /**
   * 分享图片 - 增强移动端兼容性
   */
  const shareImage = async () => {
    if (!generatedImage) return

    try {
      // 移动端优先使用原生分享API
      if (navigator.share) {
        try {
          // 将base64转换为blob
          const response = await fetch(generatedImage)
          const blob = await response.blob()
          
          // 检查是否支持文件分享
          if (navigator.canShare && navigator.canShare({ files: [new File([blob], '实惠小贴士.png', { type: 'image/png' })] })) {
            const file = new File([blob], '实惠小贴士.png', { type: 'image/png' })
            await navigator.share({
              title: '实惠小贴士',
              text: '来看看我的购物比价分析！',
              files: [file]
            })
            return
          } else {
            // 不支持文件分享，只分享链接和文本
            await navigator.share({
              title: '实惠小贴士',
              text: '来看看我的购物比价分析！\n\n' + window.location.href,
              url: window.location.href
            })
            // 然后自动下载图片
            downloadImage()
            return
          }
        } catch (shareError) {
          console.log('原生分享失败，尝试其他方式:', shareError)
        }
      }

      // 桌面端或不支持分享的浏览器：直接下载
      downloadImage()
      
      // 尝试复制链接到剪贴板
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('图片已保存到下载文件夹，链接已复制到剪贴板！')
        } catch (clipError) {
          alert('图片已保存到下载文件夹！')
        }
      } else {
        alert('图片已保存到下载文件夹！')
      }
    } catch (error) {
      console.error('分享失败:', error)
      downloadImage()
      alert('图片已保存到下载文件夹！')
    }
  }

  // 获取最实惠的商品
  const bestProduct = rankings[0]
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">
            分享实惠小贴士
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* 图片预览或模板 */}
        <div className="p-4">
          {generatedImage ? (
            // 显示生成的图片
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={generatedImage} 
                  alt="实惠小贴士分享图" 
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                  <p className="text-white text-xs text-center">
                    💡 长按图片可直接保存到相册
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareImage}
                  className="bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <span className="mr-1">📤</span>
                  分享图片
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <span className="mr-1">💾</span>
                  保存图片
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">💡</span>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium mb-1">移动端保存提示</p>
                    <p className="text-xs text-yellow-700">
                      1. 点击"分享图片"可通过系统分享<br/>
                      2. 长按上方图片选择"保存图片"<br/>
                      3. 或使用"保存图片"按钮触发下载
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setGeneratedImage(null)}
                className="w-full text-blue-600 py-2 text-sm hover:text-blue-700"
              >
                重新生成
              </button>
            </div>
          ) : (
            // 显示模板预览
            <div className="space-y-4">
              {/* 模板预览 */}
              <div 
                ref={templateRef}
                data-share-template
                className="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-5 rounded-3xl text-white relative overflow-hidden"
                style={{ 
                  width: '360px', 
                  height: '480px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif'
                }}
              >
                {/* 装饰性背景元素 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/8 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute top-20 right-10 w-16 h-16 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/6 rounded-full translate-y-10 -translate-x-10"></div>
                <div className="absolute bottom-32 left-8 w-8 h-8 bg-white/8 rounded-full"></div>
                
                {/* 头部 - 优化布局 */}
                <div className="text-center mb-4 relative z-10">
                  <div className="inline-block bg-white/25 backdrop-blur-sm rounded-2xl px-4 py-2 mb-2 shadow-lg">
                    <h1 className="text-lg font-bold flex items-center justify-center">
                      <span className="mr-2">🛒</span>
                      实惠助手
                    </h1>
                  </div>
                  <p className="text-white/95 text-sm font-semibold mb-2 tracking-wide">精明消费，省钱有道</p>
                  <div className="inline-block bg-white/15 backdrop-blur rounded-full px-3 py-1">
                    <p className="text-white/85 text-xs font-medium">{currentDate}</p>
                  </div>
                </div>

                {/* 最实惠选择 - 优化设计 */}
                {bestProduct && (
                  <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/40 shadow-xl relative z-10">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-white font-bold text-sm">💡</span>
                      </div>
                      <h3 className="text-base font-bold text-white">最实惠选择</h3>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur rounded-xl p-3 mb-3">
                      <p className="text-base font-bold text-center text-white mb-1">
                        {bestProduct.name || `商品${bestProduct.id}`}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-400/80 to-emerald-500/80 backdrop-blur rounded-xl p-3 text-center shadow-lg">
                      <p className="text-xs text-white/90 font-medium mb-1">单价仅需</p>
                      <p className="text-2xl font-black text-white tracking-tight">
                        ¥{bestProduct.formattedUnitPrice}
                        <span className="text-sm font-semibold ml-1">/{selectedUnit}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* 价格排名 - 优化设计 */}
                {rankings.length > 1 && (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg relative z-10">
                    <div className="flex items-center mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-white font-bold text-xs">📊</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">价格排名</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {rankings.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="bg-white/15 backdrop-blur rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                          <div className="flex items-center flex-1">
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 shadow-sm
                              ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900' : 
                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' : 
                                'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900'}
                            `}>
                              {index + 1}
                            </div>
                            <span className="text-xs font-semibold text-white/95 truncate max-w-[120px]">
                              {product.name || `商品${product.id}`}
                            </span>
                          </div>
                          <div className="bg-white/25 backdrop-blur rounded-lg px-2.5 py-1 shadow-sm">
                            <span className="font-bold text-xs text-white">¥{product.formattedUnitPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {rankings.length > 3 && (
                      <div className="mt-2 text-center">
                        <p className="text-xs text-white/70 font-medium">
                          还有 {rankings.length - 3} 个商品...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 底部品牌区域 - 优化设计 */}
                <div className="absolute bottom-5 left-5 right-5 text-center relative z-10">
                  <div className="border-t border-white/25 pt-3">
                    <div className="bg-white/25 backdrop-blur-md rounded-full px-4 py-2 inline-block shadow-lg">
                      <p className="text-xs text-white/95 font-semibold flex items-center justify-center">
                        <span className="mr-1.5">✨</span>
                        由 实惠助手 智能生成
                        <span className="ml-1.5">✨</span>
                      </p>
                    </div>
                    <p className="text-xs text-white/60 font-medium mt-2 tracking-wide">
                      让每一分钱都花得更值
                    </p>
                  </div>
                </div>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={generateImage}
                disabled={isGenerating || rankings.length === 0}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? '生成中...' : '生成分享图片'}
              </button>
              
              {rankings.length === 0 && (
                <p className="text-sm text-neutral-500 text-center">
                  请先添加商品数据后再生成分享图片
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareImage 