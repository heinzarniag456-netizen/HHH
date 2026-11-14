# HHH AI — Web App

HHH AI သည် မြန်မာ၊ English အပါအဝင် ဘာသာစကားမျိုးစုံဖြင့် စကားပြောနိုင်ရန် ပြင်ဆင်ထားသော AI chat web app starter ဖြစ်သည်။

## လိုအပ်ချက်
- Node.js 20 သို့မဟုတ် နောက်ပိုင်း
- OpenAI API key (API အသုံးပြုခွင့်နှင့် billing သတ်မှတ်ထားရန် လိုနိုင်သည်)

## ကိုယ့်ကွန်ပျူတာမှာ စမ်းသပ်ရန်
1. ဒီ project folder ကို ဖြည်ပါ။
2. Terminal / Command Prompt ကို ဖွင့်ပြီး project folder ထဲဝင်ပါ။
3. `npm install` ကို run ပါ။
4. `.env.example` ကို `.env` အဖြစ် copy လုပ်ပါ။
5. `.env` ထဲမှာ `OPENAI_API_KEY=...` ကို ကိုယ့် API key နဲ့ အစားထိုးပါ။
6. `npm start` ကို run ပါ။
7. Browser မှာ `http://localhost:3000` ကို ဖွင့်ပါ။

## Model ပြောင်းရန်
`.env` ထဲက `OPENAI_MODEL=gpt-5.5` ကို ကိုယ့် API project မှာ အသုံးပြုခွင့်ရှိတဲ့ model အမည်နဲ့ ပြောင်းနိုင်ပါတယ်။

## Online တင်ရန်
Node.js server ကို support လုပ်တဲ့ hosting တစ်ခုမှာ project ကို deploy လုပ်ပါ။ Hosting ရဲ့ Environment Variables / Secrets ထဲမှာ `OPENAI_API_KEY` နဲ့ `OPENAI_MODEL` ကို ထည့်ပါ။ `.env` ဖိုင် သို့မဟုတ် API key ကို public repository ထဲ မတင်ပါနှင့်။

## လုံခြုံရေးနှင့် ကန့်သတ်ချက်
- API key ကို browser JavaScript ထဲ မထည့်ထားပါ။ Server ကသာ အသုံးပြုသည်။
- Chat history ကို လက်ရှိ browser ရဲ့ localStorage ထဲမှာသာ သိမ်းသည်။ အခြားစက်သို့ အလိုအလျောက် မကူးပါ။
- ဒီ starter မှာ login/account sync မပါသေးပါ။
- Production အသုံးပြုမှုမပြုမီ user authentication, database, stricter rate limiting, abuse monitoring, spending limits တို့ ထပ်ထည့်ရန် အကြံပြုသည်။
- AI API အသုံးပြုခ ကုန်ကျနိုင်သည်။ API key ကို မျှဝေမပေးပါနှင့်။

## အသုံးပြုထားသော API
OpenAI official JavaScript SDK နှင့် Responses API ကို server-side မှ ခေါ်ထားသည်။
