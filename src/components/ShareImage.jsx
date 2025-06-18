/**
 * ShareImage 组件 - 分享图片生成组件
 * 用于生成可分享的"实惠小贴士"图片
 * 优化移动端兼容性和图片生成质量
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
   * 生成分享图片 - 优化移动端兼容性
   */
  const generateImage = async () => {
    if (!templateRef.current) {
      console.error('模板引用不存在')
      return
    }

    try {
      setIsGenerating(true)
      
      // 移动端需要更长时间确保DOM完全渲染
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 获取设备像素比，确保高清图片
      const pixelRatio = window.devicePixelRatio || 1
      const scale = Math.min(pixelRatio * 1.5, 3) // 限制最大缩放，避免内存问题
      
      // 优化移动端的html2canvas配置
      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: '#7c3aed',
        scale: scale,
        useCORS: true,
        allowTaint: false,
        width: 360,
        height: 480,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        logging: false,
        // 移动端优化配置
        foreignObjectRendering: false, // 禁用foreignObject渲染，提高兼容性
        removeContainer: true, // 移除容器，避免布局问题
        windowWidth: 360,
        windowHeight: 480,
        onclone: (clonedDoc, element) => {
          // 确保克隆的文档中包含所有样式
          const clonedElement = clonedDoc.querySelector('[data-share-template]')
          if (clonedElement) {
            // 重置所有可能影响渲染的样式
            clonedElement.style.transform = 'none'
            clonedElement.style.position = 'relative'
            clonedElement.style.top = '0'
            clonedElement.style.left = '0'
            clonedElement.style.margin = '0'
            clonedElement.style.padding = '0'
            clonedElement.style.width = '360px'
            clonedElement.style.height = '480px'
            clonedElement.style.overflow = 'hidden'
            clonedElement.style.boxSizing = 'border-box'
            
            // 确保所有子元素的定位正确
            const absoluteElements = clonedElement.querySelectorAll('.absolute')
            absoluteElements.forEach(el => {
              el.style.position = 'absolute'
            })
          }
          
          // 为克隆文档添加必要的CSS
          const style = clonedDoc.createElement('style')
          style.textContent = `
            * { box-sizing: border-box; }
            .absolute { position: absolute; }
            .relative { position: relative; }
            .z-10 { z-index: 10; }
            .overflow-hidden { overflow: hidden; }
            .rounded-full { border-radius: 9999px; }
            .rounded-xl { border-radius: 0.75rem; }
            .rounded-2xl { border-radius: 1rem; }
            .rounded-3xl { border-radius: 1.5rem; }
            .bg-white\\/8 { background-color: rgba(255, 255, 255, 0.08); }
            .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
            .bg-white\\/6 { background-color: rgba(255, 255, 255, 0.06); }
            .bg-white\\/15 { background-color: rgba(255, 255, 255, 0.15); }
            .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.20); }
            .bg-white\\/25 { background-color: rgba(255, 255, 255, 0.25); }
            .bg-white\\/30 { background-color: rgba(255, 255, 255, 0.30); }
            .backdrop-blur-sm { backdrop-filter: blur(4px); }
            .backdrop-blur { backdrop-filter: blur(8px); }
            .backdrop-blur-md { backdrop-filter: blur(12px); }
          `
          clonedDoc.head.appendChild(style)
        }
      })

      // 转换为图片数据，提高图片质量
      const imageDataUrl = canvas.toDataURL('image/png', 1.0)
      setGeneratedImage(imageDataUrl)
      
    } catch (error) {
      console.error('生成图片失败:', error)
      // 提供更详细的错误信息
      const errorMsg = error.message.includes('tainted') 
        ? '图片包含跨域资源，请刷新页面重试'
        : error.message.includes('size') 
        ? '图片尺寸过大，请重试'
        : '生成图片失败，请重试'
      alert(`${errorMsg}\n\n错误详情：${error.message}`)
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
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // 移动端直接显示提示，引导用户手动保存
        alert('移动端保存步骤：\n\n1. 长按下方预览图片\n2. 选择"保存图片"或"下载图片"\n3. 图片将保存到相册\n\n注：这是浏览器安全限制，需要手动操作')
      } else {
        // 桌面端尝试自动下载
        const link = document.createElement('a')
        const fileName = `实惠小贴士-${new Date().toLocaleDateString().replace(/\//g, '-')}.png`
        
        link.download = fileName
        link.href = generatedImage
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        alert('图片已下载到下载文件夹！')
      }
      
    } catch (error) {
      console.error('下载失败:', error)
      alert('请长按图片手动保存到相册')
    }
  }

  /**
   * 分享图片 - 增强移动端兼容性
   */
  const shareImage = async () => {
    if (!generatedImage) return

    try {
      // 优先使用原生分享API（主要在移动端可用）
      if (navigator.share) {
        try {
          // 将base64转换为blob
          const response = await fetch(generatedImage)
          const blob = await response.blob()
          
          // 检查是否支持文件分享
          if (navigator.canShare && navigator.canShare({ files: [new File([blob], '实惠小贴士.png', { type: 'image/png' })] })) {
            const file = new File([blob], '实惠小贴士.png', { type: 'image/png' })
            await navigator.share({
              title: '实惠小贴士 - 购物比价神器',
              text: '我用实惠助手找到了最划算的商品！快来看看我的购物比价分析 💰',
              files: [file]
            })
            return
          } else {
            // 不支持文件分享，只分享链接和文本
            await navigator.share({
              title: '实惠小贴士 - 购物比价神器',
              text: '我用实惠助手找到了最划算的商品！快来看看我的购物比价分析 💰\n\n访问链接：' + window.location.href,
              url: window.location.href
            })
            // 分享后提示用户保存图片
            setTimeout(() => {
              alert('分享成功！\n\n图片保存提示：\n请长按下方预览图片，选择"保存图片"保存到相册')
            }, 1000)
            return
          }
        } catch (shareError) {
          console.log('原生分享失败，尝试其他方式:', shareError)
        }
      }

      // 备选方案：复制链接 + 提示保存图片
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('分享链接已复制到剪贴板！\n\n图片保存：请长按下方图片，选择"保存到相册"')
        } catch (clipError) {
          alert('请手动复制页面链接分享，并长按下方图片保存到相册')
        }
      } else {
        alert('请手动复制页面链接分享，并长按下方图片保存到相册')
      }
      
    } catch (error) {
      console.error('分享失败:', error)
      alert('请长按下方图片保存到相册，并手动分享页面链接')
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
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    aspectRatio: '3/4'  // 保持3:4比例
                  }}
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
                  className="bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center touch-target"
                >
                  <span className="mr-1">📤</span>
                  分享图片
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center touch-target"
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
                      1. 点击"分享图片"使用系统分享功能<br/>
                      2. 长按上方图片选择"保存图片"<br/>
                      3. 或点击"保存图片"查看保存说明
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setGeneratedImage(null)}
                className="w-full text-blue-600 py-2 text-sm hover:text-blue-700 touch-target"
              >
                重新生成
              </button>
            </div>
          ) : (
            // 显示模板预览 - 优化移动端显示
            <div className="space-y-4">
              {/* 模板预览 - 使用响应式尺寸 */}
              <div className="flex justify-center">
                <div 
                  ref={templateRef}
                  data-share-template
                  className="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white relative overflow-hidden"
                  style={{ 
                    width: '360px', 
                    height: '480px',
                    borderRadius: '24px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
                    position: 'relative'
                  }}
                >
                  {/* 装饰性背景元素 - 优化定位 */}
                  <div className="absolute" style={{
                    top: '-64px', 
                    right: '-64px', 
                    width: '128px', 
                    height: '128px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                    borderRadius: '50%'
                  }}></div>
                  <div className="absolute" style={{
                    top: '80px', 
                    right: '40px', 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '50%'
                  }}></div>
                  <div className="absolute" style={{
                    bottom: '-40px', 
                    left: '-40px', 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                    borderRadius: '50%'
                  }}></div>
                  <div className="absolute" style={{
                    bottom: '128px', 
                    left: '32px', 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                    borderRadius: '50%'
                  }}></div>
                  
                  {/* 头部 - 优化布局 */}
                  <div style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      marginBottom: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h1 style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <span>🛒</span>
                        实惠助手
                      </h1>
                    </div>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      letterSpacing: '0.025em',
                      margin: '0 0 8px 0'
                    }}>精明消费，省钱有道</p>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '20px',
                      padding: '4px 12px'
                    }}>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        margin: 0
                      }}>{currentDate}</p>
                    </div>
                  </div>

                  {/* 最实惠选择 - 优化设计 */}
                  {bestProduct && (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.30)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.40)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 10
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>💡</span>
                        </div>
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          margin: 0
                        }}>最实惠选择</h3>
                      </div>
                      
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.20)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '12px'
                      }}>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          textAlign: 'center', 
                          color: 'white',
                          margin: '0 0 4px 0'
                        }}>
                          {bestProduct.name || `商品${bestProduct.id}`}
                        </p>
                      </div>
                      
                      <div style={{
                        background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}>
                        <p style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.9)', 
                          fontWeight: '500',
                          marginBottom: '4px',
                          margin: '0 0 4px 0'
                        }}>单价仅需</p>
                        <p style={{ 
                          fontSize: '24px', 
                          fontWeight: '900', 
                          color: 'white',
                          letterSpacing: '-0.025em',
                          margin: 0
                        }}>
                          ¥{bestProduct.formattedUnitPrice}
                          <span style={{ fontSize: '14px', fontWeight: '600', marginLeft: '4px' }}>/{selectedUnit}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 价格排名 - 优化设计 */}
                  {rankings.length > 1 && (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.20)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.30)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 10
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: 'linear-gradient(135deg, #60a5fa 0%, #6366f1 100%)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>📊</span>
                        </div>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          margin: 0
                        }}>价格排名</h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {rankings.slice(0, 3).map((product, index) => (
                          <div key={product.id} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '12px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginRight: '12px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #eab308 100%)' :
                                           index === 1 ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' :
                                           'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                                color: index === 0 ? '#92400e' : index === 1 ? '#374151' : '#ea580c'
                              }}>
                                {index + 1}
                              </div>
                              <span style={{ 
                                fontSize: '12px', 
                                fontWeight: '600', 
                                color: 'rgba(255, 255, 255, 0.95)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '120px'
                              }}>
                                {product.name || `商品${product.id}`}
                              </span>
                            </div>
                            <div style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '8px',
                              padding: '4px 10px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}>
                              <span style={{ 
                                fontWeight: 'bold', 
                                fontSize: '12px', 
                                color: 'white' 
                              }}>¥{product.formattedUnitPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {rankings.length > 3 && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <p style={{ 
                            fontSize: '12px', 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontWeight: '500',
                            margin: 0
                          }}>
                            还有 {rankings.length - 3} 个商品...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 底部品牌区域 - 优化设计 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    textAlign: 'center',
                    zIndex: 10
                  }}>
                    <div style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                      paddingTop: '12px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        display: 'inline-block',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}>
                        <p style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.95)', 
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          margin: 0
                        }}>
                          <span>✨</span>
                          由 实惠助手 智能生成
                          <span>✨</span>
                        </p>
                      </div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        fontWeight: '500',
                        marginTop: '8px',
                        letterSpacing: '0.025em',
                        margin: '8px 0 0 0'
                      }}>
                        让每一分钱都花得更值
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={generateImage}
                disabled={isGenerating || rankings.length === 0}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
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