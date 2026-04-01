import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            OKX AI 交易系统
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            让 AI 从每次交易中学习，持续优化交易策略
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              模拟盘交易
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              OKX 模拟账户实时运行，积累交易数据
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-blue-500">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI 自动复盘
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              每笔交易后 Claude 自动分析，提取经验教训
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              策略优化
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              从复盘中提取可复用规则，持续进化
            </p>
          </div>
        </div>

        {/* CTA 按钮 */}
        <div className="flex justify-center gap-4">
          <Link
            href="/reflection"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            开始 AI 复盘 →
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* 系统状态 */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            系统状态
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  3
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">运行策略</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">累计交易</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI 复盘</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">提取策略</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Next.js + Claude AI + OKX API</p>
          <p className="mt-2">© 2026 OKX AI Trading System</p>
        </div>
      </div>
    </main>
  )
}
