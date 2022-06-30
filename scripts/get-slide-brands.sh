#!/bin/bash
# REPLACE THESE VALUES
SLIDE_CLIENT_ID=${SLIDE_CLIENT_ID:-359e8708-ee2a-4deb-8c15-0e29fe934cda}
SLIDE_CLIENT_SECRET=${SLIDE_CLIENT_SECRET:-ZWYAEAW4UZ6SMZLGCEF6}
SLIDE_BASE_URL=${SLIDE_BASE_URL:-https://sandbox-api.getslide.com}

# These are calculated automatically.
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "$TIMESTAMP;$SLIDE_CLIENT_SECRET;v1/brands" | shasum -a 256)
SIGNATURE="v1:${SIGNATURE::-3}"

RESPONSE=$(curl -s --request GET --url "$SLIDE_BASE_URL/v1/brands" -H "x-client: $SLIDE_CLIENT_ID" -H  "x-signature: $SIGNATURE" -H  "x-timestamp: $TIMESTAMP" -H "BRANDS_VERSION: v2")

# If you want a JSON response
# echo $RESPONSE | jq '.data[] | { id: .id, brand_name: .attributes.brand_name, categories: [.attributes.categories[].name] }'

# If you want a Table representation you can copy and past into Confluence
echo '| ID | BRAND_NAME | CATEGORIES |'
echo '| --- | --- | --- |'
echo $RESPONSE | jq -r '.data[] | "| `\(.id)` | \(.attributes.brand_name) | \([.attributes.categories[].name] | map("`\(.)`") |  join(", ")) |"'
