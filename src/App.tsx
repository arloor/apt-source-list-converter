import { useState } from "react";
import { ArrowRight, Copy, Check } from "lucide-react";

export default function AptConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToDeb822 = (text: string) => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const results: string[] = [];

    lines.forEach((line) => {
      line = line.trim();

      // 跳过注释行
      if (line.startsWith("#")) {
        results.push(`# ${line.substring(1).trim()}`);
        return;
      }

      // 解析 oneline 格式
      const match = line.match(
        /^(deb|deb-src)\s+(\[([^\]]+)\]\s+)?(\S+)\s+(\S+)\s+(.+)$/
      );

      if (!match) {
        results.push(`# 无法解析: ${line}`);
        return;
      }

      const [, type, , options, uri, suite, components] = match;

      let deb822 = "";
      deb822 += `Types: ${type}\n`;
      deb822 += `URIs: ${uri}\n`;
      deb822 += `Suites: ${suite}\n`;
      deb822 += `Components: ${components}\n`;

      // 处理选项
      if (options) {
        const opts = options.split(/\s+/);
        opts.forEach((opt) => {
          const [key, value] = opt.split("=");
          if (key && value) {
            // 特殊处理字段名,使用正确的 deb822 格式
            const fieldMap: Record<string, string> = {
              arch: "Architectures",
              "signed-by": "Signed-By",
              lang: "Languages",
              target: "Targets",
              pdiffs: "PDiffs",
              "by-hash": "By-Hash",
              trusted: "Trusted",
            };
            const fieldName =
              fieldMap[key.toLowerCase()] ||
              key.charAt(0).toUpperCase() + key.slice(1);
            deb822 += `${fieldName}: ${value}\n`;
          }
        });
      }

      results.push(deb822);
    });

    return results.join("\n");
  };

  const handleConvert = () => {
    const result = convertToDeb822(input);
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleInput = `deb http://archive.ubuntu.com/ubuntu jammy main restricted
deb [arch=amd64 signed-by=/usr/share/keyrings/example.gpg] https://example.com/debian stable main contrib
deb-src http://archive.ubuntu.com/ubuntu jammy main`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-800">
            APT 源格式转换器
          </h1>
          <p className="text-slate-600">将 oneline 格式转换为 deb822 格式</p>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700">
                Oneline 格式
              </h2>
              <button
                onClick={() => setInput(exampleInput)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                加载示例
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴 oneline 格式的 APT 源配置..."
              className="h-96 w-full resize-none rounded-lg border border-slate-300 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700">
                Deb822 格式
              </h2>
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "已复制" : "复制"}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="转换结果将显示在这里..."
              className="h-96 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            转换 <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            格式说明
          </h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <strong>Oneline 格式示例：</strong>
            </p>
            <code className="block rounded bg-slate-100 p-2">
              deb [arch=amd64] http://example.com/ubuntu jammy main contrib
            </code>
            <p className="mt-4">
              <strong>Deb822 格式示例：</strong>
            </p>
            <code className="block whitespace-pre rounded bg-slate-100 p-2">
              {`Types: deb
URIs: http://example.com/ubuntu
Suites: jammy
Components: main contrib
Architectures: amd64
Signed-By: /usr/share/keyrings/example.gpg`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
