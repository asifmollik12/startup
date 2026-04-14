import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder as FounderModel } from "@/lib/models/Founder";

const founders = [
  {
    name: "Afeef Zaman", slug: "afeef-zaman", title: "Founder & CEO",
    company: "ShopUp", industry: "B2B Commerce", avatar: "", coverImage: "",
    bio: "Afeef Zaman is the Founder & CEO of ShopUp, a B2B commerce and fintech platform empowering small retailers across Bangladesh.",
    netWorth: "Not public", founded: "2016", location: "Dhaka", achievements: [], socialLinks: {}, rank: 1,
  },
  {
    name: "Ayman Sadiq", slug: "ayman-sadiq", title: "Founder & CEO",
    company: "10 Minute School", industry: "EdTech", avatar: "", coverImage: "",
    bio: "Ayman Sadiq founded 10 Minute School, Bangladesh's largest online education platform, making quality learning accessible to millions.",
    netWorth: "Not public", founded: "2015", location: "Dhaka", achievements: [], socialLinks: {}, rank: 2,
  },
  {
    name: "Hussain M Elius", slug: "hussain-m-elius", title: "Co-founder",
    company: "Pathao", industry: "Mobility", avatar: "", coverImage: "",
    bio: "Hussain M Elius co-founded Pathao, Bangladesh's leading ride-sharing and logistics super app.",
    netWorth: "Not public", founded: "2015", location: "Dhaka", achievements: [], socialLinks: {}, rank: 3,
  },
  {
    name: "Waseem Alim", slug: "waseem-alim", title: "Co-founder & CEO",
    company: "Chaldal", industry: "E-commerce", avatar: "", coverImage: "",
    bio: "Waseem Alim co-founded Chaldal, Bangladesh's first and largest online grocery delivery platform.",
    netWorth: "Not public", founded: "2013", location: "Dhaka", achievements: [], socialLinks: {}, rank: 4,
  },
  {
    name: "Fahim Mashroor", slug: "fahim-mashroor", title: "Founder",
    company: "Bdjobs, Ajkerdeal", industry: "HR Tech", avatar: "", coverImage: "",
    bio: "Fahim Mashroor founded Bdjobs and Ajkerdeal, pioneering online job listings and e-commerce in Bangladesh.",
    netWorth: "$35M+", founded: "2000", location: "Dhaka", achievements: [], socialLinks: {}, rank: 5,
  },
  {
    name: "Iqbal Quadir", slug: "iqbal-quadir", title: "Founder",
    company: "GrameenPhone", industry: "Telecom", avatar: "", coverImage: "",
    bio: "Iqbal Quadir founded GrameenPhone, transforming telecommunications and social business in Bangladesh.",
    netWorth: "Not public", founded: "1997", location: "Dhaka", achievements: [], socialLinks: {}, rank: 6,
  },
  {
    name: "Kamal Quadir", slug: "kamal-quadir", title: "Co-founder & CEO",
    company: "bKash", industry: "Fintech", avatar: "", coverImage: "",
    bio: "Kamal Quadir co-founded bKash, the mobile financial service that transformed banking access for millions of Bangladeshis.",
    netWorth: "Not public", founded: "2011", location: "Dhaka", achievements: [], socialLinks: {}, rank: 7,
  },
  {
    name: "Zia Ashraf", slug: "zia-ashraf", title: "Co-founder",
    company: "Chaldal", industry: "E-commerce", avatar: "", coverImage: "",
    bio: "Zia Ashraf co-founded Chaldal, building Bangladesh's leading online grocery delivery service.",
    netWorth: "Not public", founded: "2013", location: "Dhaka", achievements: [], socialLinks: {}, rank: 8,
  },
  {
    name: "Zeeshan Zakaria", slug: "zeeshan-zakaria", title: "Co-founder",
    company: "Shikho", industry: "EdTech", avatar: "", coverImage: "",
    bio: "Zeeshan Zakaria co-founded Shikho, a leading EdTech platform making quality education accessible across Bangladesh.",
    netWorth: "Not public", founded: "2019", location: "Dhaka", achievements: [], socialLinks: {}, rank: 9,
  },
  {
    name: "Fahad Ifaz", slug: "fahad-ifaz", title: "Founder & CEO",
    company: "iFarmer", industry: "Agritech", avatar: "", coverImage: "",
    bio: "Fahad Ifaz founded iFarmer, a fintech and agritech platform connecting farmers with financing and markets in Bangladesh.",
    netWorth: "Not public", founded: "2018", location: "Dhaka", achievements: [], socialLinks: {}, rank: 10,
  },
  {
    name: "Reyasat Chowdhury", slug: "reyasat-chowdhury", title: "Co-founder",
    company: "Shuttle", industry: "Mobility", avatar: "", coverImage: "",
    bio: "Reyasat Chowdhury co-founded Shuttle, a safe and affordable commuter bus service for working professionals in Dhaka.",
    netWorth: "Not public", founded: "2016", location: "Dhaka", achievements: [], socialLinks: {}, rank: 11,
  },
  {
    name: "Nazmul Sheikh", slug: "nazmul-sheikh", title: "Founder",
    company: "Shajgoj", industry: "Beauty / E-commerce", avatar: "", coverImage: "",
    bio: "Nazmul Sheikh founded Shajgoj, Bangladesh's largest beauty and personal care e-commerce platform.",
    netWorth: "Not public", founded: "2013", location: "Dhaka", achievements: [], socialLinks: {}, rank: 12,
  },
  {
    name: "Anayet Rashid", slug: "anayet-rashid", title: "Founder",
    company: "Truck Lagbe", industry: "Logistics", avatar: "", coverImage: "",
    bio: "Anayet Rashid founded Truck Lagbe, an on-demand truck booking platform revolutionizing freight logistics in Bangladesh.",
    netWorth: "Not public", founded: "2016", location: "Dhaka", achievements: [], socialLinks: {}, rank: 13,
  },
  {
    name: "Aziz Arman", slug: "aziz-arman", title: "Founder",
    company: "Jatri", industry: "Mobility Tech", avatar: "", coverImage: "",
    bio: "Aziz Arman founded Jatri, a mobility tech startup improving urban transportation experiences in Bangladesh.",
    netWorth: "Not public", founded: "2019", location: "Dhaka", achievements: [], socialLinks: {}, rank: 14,
  },
  {
    name: "Rubaiyat Farhan", slug: "rubaiyat-farhan", title: "Co-founder",
    company: "Markopolo.ai", industry: "AI / Marketing Tech", avatar: "", coverImage: "",
    bio: "Rubaiyat Farhan co-founded Markopolo.ai, an AI-powered marketing automation platform helping businesses grow across Bangladesh and beyond.",
    netWorth: "Not public", founded: "2020", location: "Dhaka", achievements: [], socialLinks: {}, rank: 15,
  },
  {
    name: "Tasfia Tasbin", slug: "tasfia-tasbin", title: "Co-founder",
    company: "Markopolo.ai", industry: "AI / Marketing Tech", avatar: "", coverImage: "",
    bio: "Tasfia Tasbin co-founded Markopolo.ai, driving AI-driven marketing solutions for businesses in emerging markets.",
    netWorth: "Not public", founded: "2020", location: "Dhaka", achievements: [], socialLinks: {}, rank: 16,
  },
  {
    name: "Arefin Zaman", slug: "arefin-zaman", title: "Co-founder",
    company: "MedEasy", industry: "Healthcare Tech", avatar: "", coverImage: "",
    bio: "Arefin Zaman co-founded MedEasy, a healthcare tech platform making medicine delivery and health services accessible across Bangladesh.",
    netWorth: "Not public", founded: "2020", location: "Dhaka", achievements: [], socialLinks: {}, rank: 17,
  },
  {
    name: "Sakib Hossain", slug: "sakib-hossain", title: "Founder",
    company: "Fashol", industry: "Agritech", avatar: "", coverImage: "",
    bio: "Sakib Hossain founded Fashol, an agritech startup connecting farmers directly to consumers and reducing food supply chain waste.",
    netWorth: "Not public", founded: "2021", location: "Dhaka", achievements: [], socialLinks: {}, rank: 18,
  },
  {
    name: "Sayed Zubaer Hasan", slug: "sayed-zubaer-hasan", title: "Co-founder",
    company: "Krishi Shwapno", industry: "Agritech", avatar: "", coverImage: "",
    bio: "Sayed Zubaer Hasan co-founded Krishi Shwapno, an agritech and social impact startup empowering Bangladeshi farmers.",
    netWorth: "Not public", founded: "2019", location: "Dhaka", achievements: [], socialLinks: {}, rank: 19,
  },
  {
    name: "Mahmudul Hasan Sohag", slug: "mahmudul-hasan-sohag", title: "Founder",
    company: "Rokomari", industry: "E-commerce", avatar: "", coverImage: "",
    bio: "Mahmudul Hasan Sohag founded Rokomari, Bangladesh's largest online bookstore and e-commerce publishing platform.",
    netWorth: "Not public", founded: "2012", location: "Dhaka", achievements: [], socialLinks: {}, rank: 20,
  },
];

export async function GET() {
  try {
    await connectDB();
    await FounderModel.deleteMany({});
    await FounderModel.insertMany(founders);
    return NextResponse.json({ success: true, count: founders.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
