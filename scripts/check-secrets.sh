#!/bin/bash
# 數據一致性檢核腳本
# 檢查 SecretVault 金鑰是否皆能成功解密
# 使用方式：./scripts/check-secrets.sh [API_BASE_URL]
# 範例：./scripts/check-secrets.sh http://localhost:8787

BASE="${1:-http://localhost:8787}"
RES=$(curl -s "$BASE/api/trust/check-secrets")

if echo "$RES" | grep -q '"failed":0'; then
  echo "✅ 全部金鑰檢核通過"
  exit 0
fi

echo "❌ 金鑰檢核失敗或發現損壞"
echo "$RES"
exit 1
