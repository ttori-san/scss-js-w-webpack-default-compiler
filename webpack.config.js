//path モジュールの読み込み
const path = require('path');
//MiniCssExtractPlugin の読み込み
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// CleanWebpackPlugin の読み込み
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// production モード以外の場合、変数 enabledSourceMap は true
const enabledSourceMap =  process.env.NODE_ENV !== 'production';
 
module.exports = {
 
  //エントリポイント（デフォルトと同じなので省略可）
  entry: './src/index.js',  
  //出力先（デフォルトと同じなので省略可）
  output: { 
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath を追加
    publicPath: '',
  },
  //webpack-dev-server の設定
  devServer: {
    //ルートディレクトリの指定
    contentBase: path.join(__dirname, ''),
    //サーバー起動時にブラウザを自動的に起動
    open: true,
    // ルートディレクトリのファイルを監視
    watchContentBase: true,
    //バンドルされたファイルを出力する（実際に書き出す）
    writeToDisk: true
  },
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子(scss)
        test: /\.scss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするためのローダー
          {
            loader: "css-loader",
            options: {
              //以下を削除
              //url: false,
              // ソースマップを有効に
              sourceMap: enabledSourceMap,
              // css-loader の前に適用されるローダーの数（postcss-loader と sass-loader）
              importLoaders: 2,
            },
          },
          // PostCSS
          {
            loader: "postcss-loader",
            options: {
              // PostCSS でもソースマップを有効に
              sourceMap: enabledSourceMap,
              postcssOptions: {
                // ベンダープレフィックスを自動付与
                plugins: [
                  'autoprefixer',
                  //CSS Declaration Sorter（アルファベット順でソート）
                  ['css-declaration-sorter', { order: 'alphabetical' }],
                  //PostCSS Sort Media Queries（mobile-first でソート）
                  ['postcss-sort-media-queries', { sort: 'mobile-firstl' }],
                ],
              },
            },
          },
          // Sass を CSS へ変換するローダー
          {
            loader: "sass-loader",
            options: {
              // dart-sass を優先
              implementation: require('sass'),
              sassOptions: {
                // fibers を使わない場合は以下で false を指定
                fiber: require('fibers'),
                //outputStyle: 'expanded',
              },
              // ソースマップを有効に
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpe?g|svg|eot|wof|woff|ttf)$/i,
        use: [
          {
            //画像を出力フォルダーにコピーするローダー
            loader: 'file-loader',
            options: {
              // 画像ファイルの名前とパスの設定
              name: './images/[name].[ext]'
            }
          }
        ],
      },
    ],
  },
  //プラグインの設定
  plugins: [
    //
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      // 抽出する CSS のファイル名
      filename: "style.css",
    }),
  ],
  //source-map タイプのソースマップを出力
  devtool: "source-map",
  // node_modules を監視対象から除外
  watchOptions: {
    ignored: /node_modules/  //正規表現で指定
  },
};