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
      
             // 优化html2canvas配置确保与预览一致
       const canvas = await html2canvas(templateRef.current, {
         backgroundColor: 'transparent', // 使用透明背景，让模板自己的渐变背景生效
         scale: scale,
         useCORS: true,
         allowTaint: false,
         width: 360,
         height: 540,
         scrollX: 0,
         scrollY: 0,
         x: 0,
         y: 0,
         logging: false,
         // 关键配置：确保与预览渲染一致
         foreignObjectRendering: false,
         removeContainer: false, // 保留容器以维持布局
         windowWidth: 360,
         windowHeight: 540,
         // 新增配置：确保样式准确复制
         imageTimeout: 10000, // 增加图片加载超时
         letterRendering: true, // 确保文字渲染准确
                   ignoreElements: (element) => {
            // 忽略可能干扰的元素
            return element.classList && (
              element.classList.contains('cursor-pointer') ||
              element.classList.contains('hover:') ||
              element.getAttribute('role') === 'button'
            )
          },
        onclone: (clonedDoc, element) => {
          // 确保克隆的文档中包含所有样式
          const clonedElement = clonedDoc.querySelector('[data-share-template]')
          if (clonedElement) {
            // 保持与预览完全一致的样式 - 不重置任何样式
            // 只确保必要的布局属性
            clonedElement.style.width = '360px'
            clonedElement.style.height = '540px' // 更新高度匹配当前模板
            clonedElement.style.position = 'relative'
            clonedElement.style.overflow = 'hidden'
            clonedElement.style.boxSizing = 'border-box'
            
            // 确保flexbox属性保持一致
            clonedElement.style.display = 'flex'
            clonedElement.style.flexDirection = 'column'
            clonedElement.style.alignItems = 'center'
            clonedElement.style.justifyContent = 'flex-start'
            
            // 确保内边距与预览一致
            clonedElement.style.padding = '20px'
            
            // 保持所有内联样式不变，不重置任何transform或position
          }
          
          // 为克隆文档添加必要的CSS - 确保与预览样式完全一致
          const style = clonedDoc.createElement('style')
          style.textContent = `
            * { 
              box-sizing: border-box; 
              margin: 0; 
              padding: 0; 
            }
            
            /* 确保字体渲染一致 */
            body, * {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* 基础定位类 */
            .absolute { position: absolute; }
            .relative { position: relative; }
            .z-10 { z-index: 10; }
            .overflow-hidden { overflow: hidden; }
            
            /* 圆角样式 */
            .rounded-full { border-radius: 9999px; }
            .rounded-xl { border-radius: 0.75rem; }
            .rounded-2xl { border-radius: 1rem; }
            .rounded-3xl { border-radius: 1.5rem; }
            
            /* 背景透明度 */
            .bg-white\\/8 { background-color: rgba(255, 255, 255, 0.08); }
            .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
            .bg-white\\/6 { background-color: rgba(255, 255, 255, 0.06); }
            .bg-white\\/15 { background-color: rgba(255, 255, 255, 0.15); }
            .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.20); }
            .bg-white\\/25 { background-color: rgba(255, 255, 255, 0.25); }
            .bg-white\\/30 { background-color: rgba(255, 255, 255, 0.30); }
            
            /* 背景模糊效果 */
            .backdrop-blur-sm { backdrop-filter: blur(4px); }
            .backdrop-blur { backdrop-filter: blur(8px); }
            .backdrop-blur-md { backdrop-filter: blur(12px); }
            
            /* Flexbox 布局 */
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .justify-start { justify-content: flex-start; }
            
            /* 确保渐变背景正确渲染 */
            .bg-gradient-to-br {
              background: linear-gradient(to bottom right, #a855f7, #3730a3, #2563eb);
            }
            
            /* 文字样式确保一致 */
            h1, h2, h3, h4, h5, h6, p, span {
              margin: 0;
              padding: 0;
              line-height: 1.2;
            }
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
                    height: '540px',
                    borderRadius: '24px',
                    padding: '20px', // 增加内边距确保内容不贴边
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // 确保水平居中
                    justifyContent: 'flex-start' // 垂直从顶部开始
                  }}
                >
                  {/* 装饰性背景元素 - 优化定位 */}
                  <div style={{
                    position: 'absolute',
                    top: '-64px', 
                    right: '-64px', 
                    width: '128px', 
                    height: '128px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '80px', 
                    right: '40px', 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px', 
                    left: '-40px', 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '80px', 
                    left: '32px', 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                    borderRadius: '50%'
                  }}></div>
                  
                  {/* 头部 - 完全居中设计 */}
                  <div style={{ 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center', 
                    marginBottom: '16px',
                    position: 'relative', 
                    zIndex: 10
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      marginBottom: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>🛒</span>
                      <h1 style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        margin: 0,
                        color: 'white',
                        lineHeight: '1.2'
                      }}>
                        实惠助手
                      </h1>
                    </div>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      letterSpacing: '0.025em',
                      margin: '0 0 8px 0',
                      textAlign: 'center',
                      lineHeight: '1.3'
                    }}>精明消费，省钱有道</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '16px',
                      padding: '4px 12px'
                    }}>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        fontSize: '11px', 
                        fontWeight: '500',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>{currentDate}</p>
                    </div>
                  </div>

                  {/* 最实惠选择 - 完全居中设计 */}
                  {bestProduct && (
                    <div style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.30)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '14px',
                      padding: '14px',
                      marginBottom: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.40)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '10px',
                        width: '100%'
                      }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '10px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                          <span style={{ fontSize: '14px' }}>💡</span>
                        </div>
                        <h3 style={{ 
                          fontSize: '15px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          margin: 0,
                          lineHeight: '1.2'
                        }}>最实惠选择</h3>
                      </div>
                      
                      <div style={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.20)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '10px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <p style={{ 
                          fontSize: '15px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          margin: 0,
                          lineHeight: '1.2'
                        }}>
                          {bestProduct.name || `商品${bestProduct.id}`}
                        </p>
                      </div>
                      
                      <div style={{
                        width: '100%',
                        background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '10px',
                        padding: '10px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <p style={{ 
                          fontSize: '11px', 
                          color: 'rgba(255, 255, 255, 0.9)', 
                          fontWeight: '500',
                          margin: '0 0 4px 0',
                          lineHeight: '1.2'
                        }}>单价仅需</p>
                        <p style={{ 
                          fontSize: '22px', 
                          fontWeight: '900', 
                          color: 'white',
                          letterSpacing: '-0.025em',
                          margin: 0,
                          lineHeight: '1.1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          ¥{bestProduct.formattedUnitPrice}
                          <span style={{ fontSize: '13px', fontWeight: '600', marginLeft: '3px' }}>/{selectedUnit}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 价格排名 - 完全居中设计 */}
                  {rankings.length > 1 && (
                    <div style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.20)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '14px',
                      padding: '14px',
                      marginBottom: '18px',
                      border: '1px solid rgba(255, 255, 255, 0.30)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 10,
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '10px',
                        width: '100%'
                      }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          background: 'linear-gradient(135deg, #60a5fa 0%, #6366f1 100%)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                          <span style={{ fontSize: '12px' }}>📊</span>
                        </div>
                        <h4 style={{ 
                          fontSize: '13px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          margin: 0,
                          lineHeight: '1.2'
                        }}>价格排名</h4>
                      </div>
                      
                      <div style={{ 
                        width: '100%',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px' 
                      }}>
                        {rankings.slice(0, 3).map((product, index) => (
                          <div key={product.id} style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            minHeight: '36px' // 确保足够高度
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              flex: 1, 
                              minWidth: 0 
                            }}>
                              <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                marginRight: '10px',
                                flexShrink: 0,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #eab308 100%)' :
                                           index === 1 ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' :
                                           'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                                color: index === 0 ? '#92400e' : index === 1 ? '#374151' : '#ea580c'
                              }}>
                                {index + 1}
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: '600', 
                                color: 'rgba(255, 255, 255, 0.95)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                lineHeight: '1.3'
                              }}>
                                {product.name || `商品${product.id}`}
                              </span>
                            </div>
                            <div style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              marginLeft: '8px',
                              flexShrink: 0,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{ 
                                fontWeight: 'bold', 
                                fontSize: '11px', 
                                color: 'white',
                                lineHeight: '1.2'
                              }}>¥{product.formattedUnitPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {rankings.length > 3 && (
                        <div style={{ 
                          marginTop: '8px', 
                          textAlign: 'center',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <p style={{ 
                            fontSize: '10px', 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontWeight: '500',
                            margin: 0,
                            lineHeight: '1.2'
                          }}>
                            还有 {rankings.length - 3} 个商品...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 底部品牌区域 - 完全居中设计 */}
                  <div style={{
                    width: '100%',
                    marginTop: 'auto',
                    paddingTop: '12px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                      paddingTop: '10px',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '6px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        marginBottom: '6px'
                      }}>
                        <span style={{ fontSize: '11px', marginRight: '5px' }}>✨</span>
                        <span style={{ 
                          fontSize: '11px', 
                          color: 'rgba(255, 255, 255, 0.95)', 
                          fontWeight: '600',
                          margin: 0,
                          lineHeight: '1.2'
                        }}>由 实惠助手 智能生成</span>
                        <span style={{ fontSize: '11px', marginLeft: '5px' }}>✨</span>
                      </div>
                      <p style={{ 
                        fontSize: '10px', 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        fontWeight: '500',
                        letterSpacing: '0.025em',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: '1.2'
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