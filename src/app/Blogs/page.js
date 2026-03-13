"use client"

import { useState } from "react"

const text = {
English:{
causes:"Possible Causes",
advice:"What You Should Do",
doctor:"When To Visit Doctor"
},
Hindi:{
causes:"संभावित कारण",
advice:"क्या करना चाहिए",
doctor:"डॉक्टर के पास कब जाएं"
},
Marathi:{
causes:"संभाव्य कारण",
advice:"काय करावे",
doctor:"डॉक्टरांकडे कधी जावे"
}
}

const symptoms = [
{
id:1,
emoji:"🤒",
title:{
English:"Fever",
Hindi:"बुखार",
Marathi:"ताप"
},
guidance:{
English:{
causes:["Viral Fever","Dengue","Malaria"],
advice:["Drink plenty of water","Take rest","Monitor temperature"],
doctor:["Fever lasts more than 3 days","Severe weakness"]
},
Hindi:{
causes:["वायरल बुखार","डेंगू","मलेरिया"],
advice:["पर्याप्त पानी पिएं","आराम करें","तापमान जांचते रहें"],
doctor:["3 दिन से अधिक बुखार","अत्यधिक कमजोरी"]
},
Marathi:{
causes:["व्हायरल ताप","डेंग्यू","मलेरिया"],
advice:["पुरेसे पाणी प्या","विश्रांती घ्या","ताप तपासा"],
doctor:["3 दिवसांपेक्षा जास्त ताप","जास्त अशक्तपणा"]
}
}
},

{
id:2,
emoji:"🤕",
title:{
English:"Headache",
Hindi:"सिरदर्द",
Marathi:"डोकेदुखी"
},
guidance:{
English:{
causes:["Stress","Lack of sleep","Dehydration"],
advice:["Drink water","Rest in a quiet place","Avoid screen time"],
doctor:["Severe headache","Headache with vomiting"]
},
Hindi:{
causes:["तनाव","नींद की कमी","पानी की कमी"],
advice:["पानी पिएं","शांत जगह पर आराम करें","मोबाइल स्क्रीन कम देखें"],
doctor:["बहुत तेज सिरदर्द","उल्टी के साथ सिरदर्द"]
},
Marathi:{
causes:["ताण","झोपेची कमतरता","पाण्याची कमतरता"],
advice:["पाणी प्या","शांत ठिकाणी विश्रांती घ्या","मोबाईल स्क्रीन कमी वापरा"],
doctor:["तीव्र डोकेदुखी","उलटीसह डोकेदुखी"]
}
}
},

{
id:3,
emoji:"🤢",
title:{
English:"Vomiting",
Hindi:"उल्टी",
Marathi:"उलटी"
},
guidance:{
English:{
causes:["Food poisoning","Stomach infection"],
advice:["Drink ORS","Eat light food","Stay hydrated"],
doctor:["Vomiting for more than 1 day","Signs of dehydration"]
},
Hindi:{
causes:["फूड पॉइज़निंग","पेट का संक्रमण"],
advice:["ORS पिएं","हल्का भोजन करें","शरीर में पानी बनाए रखें"],
doctor:["1 दिन से अधिक उल्टी","डिहाइड्रेशन के लक्षण"]
},
Marathi:{
causes:["अन्न विषबाधा","पोटाचा संसर्ग"],
advice:["ORS प्या","हलके अन्न खा","शरीरात पाणी ठेवा"],
doctor:["1 दिवसापेक्षा जास्त उलटी","डिहायड्रेशनची चिन्हे"]
}
}
}
]

export default function Blogs(){

const [language,setLanguage] = useState("English")
const [search,setSearch] = useState("")
const [selected,setSelected] = useState(null)

const filtered = symptoms.filter(item =>
item.title[language].toLowerCase().includes(search.toLowerCase())
)

return(

<div className="w-full px-10 py-20 bg-teal-50 min-h-screen">

<div className="text-center mb-12">

<h1 className="text-5xl font-bold text-teal-700">
Rural Health Knowledge Center
</h1>

<p className="text-lg text-gray-600 mt-4">
Select your symptom to get simple healthcare guidance
</p>

</div>


{/* SEARCH */}

<div className="flex flex-col md:flex-row gap-4 justify-center mb-14">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search symptom..."
className="border border-teal-300 bg-white text-gray-700 px-5 py-3 rounded-xl w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-teal-500"
/>

<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
className="border border-teal-300 bg-white text-gray-700 px-5 py-3 rounded-xl focus:ring-2 focus:ring-teal-500"
>
<option>English</option>
<option>Hindi</option>
<option>Marathi</option>
</select>

</div>


{/* SYMPTOMS */}

<div className="grid grid-cols-2 md:grid-cols-3 gap-10">

{filtered.map(item =>(

<div
key={item.id}
onClick={()=>setSelected(item)}
className="bg-white border border-teal-100 shadow-md p-10 rounded-2xl text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition"
>

<div className="text-5xl mb-4">
{item.emoji}
</div>

<h3 className="font-semibold text-xl text-teal-700">
{item.title[language]}
</h3>

</div>

))}

</div>


{/* POPUP */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-8 shadow-xl relative max-h-[80vh] overflow-y-auto">

<button
onClick={()=>setSelected(null)}
className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
>
✖
</button>

<h2 className="text-3xl font-bold text-teal-700 mb-6">
{selected.emoji} {selected.title[language]}
</h2>

<h3 className="font-semibold text-gray-800 mb-2">
{text[language].causes}
</h3>

<ul className="list-disc ml-6 mb-5 text-gray-700">
{selected.guidance[language].causes.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

<h3 className="font-semibold mb-2 text-emerald-600">
{text[language].advice}
</h3>

<ul className="list-disc ml-6 mb-5 text-gray-700">
{selected.guidance[language].advice.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

<h3 className="font-semibold mb-2 text-red-600">
{text[language].doctor}
</h3>

<ul className="list-disc ml-6 text-gray-700">
{selected.guidance[language].doctor.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

</div>

</div>

)}

</div>

)
}