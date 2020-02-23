const {
  ComponentDialog,
  TextPrompt,
  WaterfallDialog
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");

const NAME_PROMPT = "NAME_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const SEARCH_DIALOG = "SEARCH_DIALOG";

const { DBUtil } = require("../dbUtil");

class SearchDialog extends ComponentDialog {
  constructor(userState) {
    super(SEARCH_DIALOG);

    // TODO:
    this.userProfile = userState.createProperty(USER_PROFILE);

    this.addDialog(new TextPrompt(NAME_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.searchStep.bind(this),
        this.newNext.bind(this)
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async newNext(step) {
    const diseaseIn = step.result;
    let dbUtils = new DBUtil();
    let out;

    let pol = await dbUtils.fetchPoliciesNew();
    console.log(pol);

     const validPolicies = pol.filter(policy => {
         if(policy.illness) {
             return (
               policy.illness.filter(name =>
                 name.toLowerCase().includes(diseaseIn.toLowerCase())
               ).length > 0
             );
         } else {
             return false;
         }
     });

     let results = [];
     for await(let policy of validPolicies) {
         let hospitals = await new DBUtil().fetchHospitals(policy.E2ESupplier);
         results = [...results, ...hospitals];
     }

     console.log(results);

    await step.context.sendActivity({
      attachments: [this.createAdaptiveCard(results)]
    });

    return await step.endDialog();
  }

  async searchStep(step) {
    return await step.prompt(NAME_PROMPT, "Please enter the disease.");
  }

  async nextSearchStep(step) {
    const diseaseIn = step.result;

    let POLICIES = [];
    new DBUtil().fetchPolicies(async function(results) {
      POLICIES = results;
      const SUPPLIERS = {
        ICICIPRU: [
          {
            name: "A V Hospital",
            address:
              "9 , Patalamma Temple Street, Basavanagudi, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560004
          },
          {
            name: "Abhaya Hospital",
            address:
              "17, Dr. M.H. Mari Gowda Road, Opp. Park Area, Wilson Garden, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560027
          },
          {
            name: "Acharya Tulsi Jain Hospital",
            address:
              "22/21, 6Th Cross, K.N. Extn, Yeshwanthpur, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560022
          },
          {
            name: "Acura Health Care Pvt Ltd",
            address:
              "# 435, 18Th Main, 6Th Block, Koramangala, Opp. To Bmtc Bus Depot (Koramangala), Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560095
          },
          {
            name: "Amrik Netralaya ",
            address:
              "346 Hrbr 1St Kalyan Nagar 4Th Cross 7 B Main, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560043
          },
          {
            name: "Ananya Hospital",
            address:
              "No. 389/44, 19Th Main 1St Block, Rajajinagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 500010
          },
          {
            name: "Apollo Hospitals",
            address:
              "# 154/11, Opp. I.I.M, Bannerghatta Road, J.P. Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560076
          },
          {
            name: "Apollo Speciality Hospital",
            address:
              "No.212 (2) 14th Cross 3rd Block , Jayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560011
          },
          {
            name: "Ashraya Hospital",
            address: "Magadi Main Road, Sunkadakatte, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560091
          },
          {
            name: "Ashwini Nursing Home",
            address:
              "# 382 Narayananappa Building Bellw Uco Bank, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560016
          },
          {
            name: "Bangalore Baptist Hospital",
            address: "Bellary Road, Hebbal, Hebbal, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560024
          },
          {
            name: "Bangalore West Lions Superspecialty Hospitals",
            address:
              "No.5, Lions Eye Hospital Road, (Off:J.C.Road), Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560002
          },
          {
            name: "Basavangudi Medical Centre",
            address:
              "# 84/1, R.V. Road, Basavanagudi, R.V. Road, Basavangndi, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560004
          },
          {
            name: "Bhanu Nursing Home",
            address:
              "69/5 B, Bommanohalli, Off Hosur Road, Bommanohall, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560068
          },
          {
            name: "Bharath Hospital",
            address:
              "# 1402, J.P. Nagar 1St Phase Kanrakpura Main Road Banga, Sarakki, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560078
          },
          {
            name: "Bharathy Hospital",
            address:
              "#4 , Nagarabhavi Main Road , Prashanth Nagar, Prashanth Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560079
          },
          {
            name: "Chaitanya Hospital",
            address:
              "No.80 , P&T Colony , R.T. Nagar , Bangalore-560032, Rt Nagar , P&T Colony, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560032
          },
          {
            name: "Chaitanya Medical Centre",
            address:
              "K.Hb. Colony Satellite Town 'A' Sector Yelakanka New Town, Yelahanka, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560064
          },
          {
            name: "Chaya Hospital",
            address:
              "# 6C-335, 4Th 'C' Main Road, 6Th Cross, Ombr Layout, Bhuvanagiri, Bhuvanagiri, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560043
          },
          {
            name: "Chord Road Hospital",
            address:
              "No: 100 Lic Colony West Of Chord Roadbasaveshwar Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560079
          },
          {
            name: "Citi Hospital",
            address:
              "25/91, Chord Road, 2Nd Block Rajajinagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560010
          },
          {
            name: "Columbia Asia Hospital",
            address:
              "Kirloskar Business Park , Bellary Road, Hebbal, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560024
          },
          {
            name: "Columbia Asia Hospital Pvt Ltd",
            address:
              "Brigade Gateway , #20/1 , Subramanganagar , Block -A  Industrial Suburub , Rajajinagar, Malleshwaram West, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560055
          },
          {
            name: "Csi-Church Of South India Hospital",
            address:
              "No 2 , Hkp Road , Bangalore-51, Near Catt. Station, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560051
          },
          {
            name: "D G Hospital",
            address: "274/275 M.K. Puttalingaiah Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560070
          },
          {
            name: "Deepa Hospital",
            address:
              "No. 27, Old Madras Road Krishna Raja Puram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560036
          },
          {
            name: "Deepak Hospital",
            address:
              "No. 259, 33Rd Cross, Kanakapura Main Road, Jayanagar 7Th Block, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560082
          },
          {
            name: "Diagram Healthcare Pvt. Ltd",
            address:
              "No. 4, Achaiah Chetty Layout, (Rmu Extn), Mekhri Circle, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560080
          },
          {
            name: "Divine Speciality Hospital",
            address:
              "No: 110, 6Th Main, 3Rd Layout, Benson Town Post, Benson Town Post, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560046
          },
          {
            name: "Dr. Mirlay'S Eye Care Center",
            address:
              "No. 9 , St. John'S Church Road, Opp St. John'S Community Center,  Next To Bharathi Nagar Police Station,Bharathi Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560045
          },
          {
            name: "Dr. T.V. Ramesh Piles Hospital",
            address:
              "1St Main, 7Th Cross, Ganganagara, Behind (Cbi), Ganganagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560032
          },
          {
            name: "Dr.Malathi Manipal Hospital",
            address:
              "#45Th Cross . 9Th Block , Jayanagar, Jayanagar 9Th Block, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560069
          },
          {
            name: "Altius Hospital Pvt ltd",
            address:
              "6/63, 59Th,Cross,4Th Block,, Me Polytechnic, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560010
          },
          {
            name: "Dr.Rudrappa'S Hopspital",
            address: "No. 5 Rajaram Mohan Roy Cross Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560025
          },
          {
            name: "Fortis Hospitals",
            address:
              "154/9 , Bannerghatta Road , Opp. Iimb, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560076
          },
          {
            name: "Fortis Hospitals Limited",
            address:
              "#14 , Cunningham Road, Cunningham Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560052
          },
          {
            name: "Fortis Hospitals Limited",
            address:
              "No.65, 1St Main Road, Near Commercial Tax Office, Sheshadripuram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560020
          },
          {
            name: "G G Hospital",
            address:
              "369-100 Road, Hal Ii Stage Indra Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560008
          },
          {
            name: "Gangothri Hospital",
            address:
              "# 27, Kuvempunagar, 100Ft Ring Road Btm Layout , Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560076
          },
          {
            name: "Garden City Hospital",
            address:
              "No 132/18, 22Nd Cross, 3Rd Block Jayanagar, Jayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560011
          },
          {
            name: "Greenview Health Care P) Ltd",
            address:
              "No. 20/21, 14 Main Hsr Layout 5Th Sector, Opp. Agona Lake, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560034
          },
          {
            name: "Gurushree Hospital",
            address:
              "# 1558, Opp Chandra Layout, Vijayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560040
          },
          {
            name: "Hcg-Curie Centre Of Oncology",
            address:
              "No. 88, 17Th  A  Main, 2Nd Cross  , 5Th  Block , Kormanagala , Kormanagala , Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560034
          },
          {
            name: "Hcg-M.S.Ramaiah Curie Centre Of Oncology",
            address:
              "M.S. Ramaiah Memorial & Hospital, Msr Nagar, Msrit Post, Mathikere, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560054
          },
          {
            name: "Healthcare Global Enterprises Limited (HCG)",
            address:
              "44/45/2, 2Nd Cross, Rajaram Mohan Roy Extn! Off Double Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560027
          },
          {
            name: "Healthcare Global Enterprises Limited (HCG)",
            address:
              "No.8 , Kalinga Road, Sampangiram Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560027
          },
          {
            name: "Hi Tech Kidney Stone Hospital",
            address:
              "6/7 Crescent Road Cross Kumar Park East Behind Sindhi School, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560001
          },
          {
            name: "Hosmat Hospital",
            address:
              "No. 45, Magrath Road, Magrath Road, Off Richmond Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560025
          },
          {
            name: "INTERNATIONAL HOSPITAL LIMITED (Fortis Hospital)",
            address:
              "111 , West Of Chord Road, Opp. Rajaji Nagar ,1St Block, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560086
          },
          {
            name: "Jupiter Hospital & Institute Of Cascular Surgery",
            address:
              "No. 28, 7Th Main, 9Th Cross, Malleshwaram, Malleshwaram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560003
          },
          {
            name: "Kamath  Nurshing Home",
            address:
              "No. 1, Venkatram Layout, Banaswadi Main Riad, Maruti Seva Nagar , Maruti Seva Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560033
          },
          {
            name: "Kaveri Speciality Hospital",
            address:
              "15/2, 4Th Cross Hosur Main Road, Madiwala, Bangalore, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560068
          },
          {
            name: "Kavya Hospital",
            address:
              "Hongasandra , Begur  Main Road, Hongasandra, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560068
          },
          {
            name: "Kethams Hospital",
            address:
              "No 51/2, Nanjappa Main Road, Vidyaranyapura, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560097
          },
          {
            name: "Koshys Hospital",
            address:
              "Tambushetty Palya Main Road, Ramamurthy Nagar Extn, Rama Murthy Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560016
          },
          {
            name: "KUSUMA HOSPITAL",
            address:
              "No.237/37, 10Th Main Road,Nagendra Block,Srinagar, , 50Ft Road , Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560050
          },
          {
            name: "Lakeside Medical Centre",
            address:
              "33/4, Meance Avenue Tank Road, Near Ulsoor Lake, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560042
          },
          {
            name: "Lakshmi Hospital",
            address:
              "402, 2Nd Cross, Judges Colony, Ganganagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560032
          },
          {
            name: "Leela Hospital & Diagnostic Centre",
            address:
              "No. 133, 9Th Cross, Margosa Road, Between 9Th And 10Th Cross, Malleshwaram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560003
          },
          {
            name: "Lokhandes Hospital",
            address:
              "3Ac 902, 9A Main, 3Rd A Cross, Kalyan Nagar 1St Block, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560043
          },
          {
            name: "M.S.Ramaiah Memorial Hospital",
            address:
              "Msrit Post New Bel Road, , Msr Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560054
          },
          {
            name: "Mallige Medical Center",
            address: "31/32,Crescent Road, , Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560001
          },
          {
            name: "Mallya Hospital",
            address:
              "Mallya Hospital, #2, Vittal Mallaya Road,, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560001
          },
          {
            name: "Manasa Hospital",
            address:
              "G. Chandranna Building, Near Old Bus Stop., Devanahall Town, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 562110
          },
          {
            name: "Manipal Health Enterprises Private Limited",
            address: "#98, Hal Airport Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560017
          },
          {
            name: "Manipal Northside Hospital",
            address: "71 , 11Th Main Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560003
          },
          {
            name: "Manjushree Nursing Home Pvt Ltd",
            address: "22/70, St. John'S Road, Ulsoor, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560042
          },
          {
            name: "Mediscope Hospital",
            address:
              "# 11, Pillanna Garden, 3Rd Stage, Off Tannery Road, Pillanna Garden, Off Tannery Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560045
          },
          {
            name: "Meenakshi Ent Speciality Centre",
            address: "2232, 23Rd Cross, Bsk Ii Stage, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560070
          },
          {
            name: "Meridian Medical Center",
            address:
              "# 14, Standage Road, Off. Mosque Road Fraser Town, Fraser Town, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560005
          },
          {
            name: "Mysore Road Hi-Tech Hospital",
            address:
              "No: 17, Panthra Palya, Near Nayadahalli Bus Stop, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560039
          },
          {
            name: "Narayana Hrudayalaya",
            address:
              "# 258/A, Bommasandra Ind Area, Anekal, Bommasandra Ind Area, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560099
          },
          {
            name: "Narayana Nethralya",
            address:
              "121/C, Chord Road, Rajaji Nagar 1St 'R' Block, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560010
          },
          {
            name:
              "Nethra Eye Hospital (Unit of Drishtidhama Hospitals pvt. Ltd)",
            address:
              "No.8 Poojary Layout 80 feet Road, RMV II STG , Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560094
          },
          {
            name: "Apollo Specialty Hospitals ",
            address:
              "Opus , 143 , 1St Cross , 5Th Block , Kormangala, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560034
          },
          {
            name: "Nova Medical Center Private Limited",
            address:
              "Sadashiv Nagar, No 222/14, 5th Main,Bellary Road, Sadashiv nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560080
          },
          {
            name: "Nu Hospitals Private Limited",
            address:
              "Ca 6, 15Th Main 11Th Cross, Padmanabhanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560070
          },
          {
            name: "P.D.Hinduja Sindhi Hospital",
            address: "12Th A Cross, Sampangiram Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560027
          },
          {
            name: "Panacea Hospitals Pvt. Ltd.",
            address:
              "No.334, 3Rd Stage, Iv Block, Basaveshwaranagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560079
          },
          {
            name: "Patil Hospital",
            address:
              "No. 42-B, Below Syndicate Bank Sri Thimmappa Complex Old Madras Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560036
          },
          {
            name: "Poornima Nursing Home",
            address:
              "Karthik Complex , 19/7 , Dinnur Main Road , R.T. Nagar, Dinnur Main Road , R.T. Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560032
          },
          {
            name: "Prabha Eye Clinic & Research Centre",
            address:
              "#504 , 40Th Cross, 8Th Block , Jayanagar, Jayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560070
          },
          {
            name: "Premier Hospital",
            address:
              "No. 2, Exservicemen Colony, 5Th Cross, Dinnur Main Road R.T. Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560032
          },
          {
            name: "Pristine Hospital & Research Centre P.Ltd",
            address:
              "# 877, Modi Hospital Road, West Of Chord Road, 2Nd Stage Extension, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560086
          },
          {
            name: "Radhakrishna Hospital",
            address:
              "No. 3/4, “Sunrise Towers”, Jp Road Girinagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560085
          },
          {
            name: "Rajmahal Vilas Hospital",
            address: "No- 138, Aecs Layout, Sanjaynagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560094
          },
          {
            name: "Rajshekar Multispeciality Hospital Pvt Ltd",
            address:
              "No. 21, 9Th Cross, J.P. Nagar I Phase, , J.P.Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560078
          },
          {
            name: "Raksha Multispeciality Hospital",
            address:
              "No. 141/142, 1St Mn, Krisnanda Nagar, Khb Colony, Police Qurts, Nandini Layout, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560096
          },
          {
            name: "Ramakrishna Hospital",
            address:
              "#808, 15Th Cross, 3Rd Block, Jayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560011
          },
          {
            name: "Rashmi Nursing Home",
            address:
              "166 9Th Cross, Indranagar 1St Stage, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560038
          },
          {
            name: "Republic Hospital",
            address:
              "No.5, Langford Garden, Near Richmond Circle, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560025
          },
          {
            name: "S.J. Hospital",
            address:
              "No.2 Nglf Layout Sanjay Nagar Main Road, Bangalore, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560094
          },
          {
            name: "S.K.Hospital",
            address:
              "No 3 1St Cross Janabharati Road Nagarabhavi, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560072
          },
          {
            name: "Sagar Hospital - Dsi",
            address:
              "Shavige Malleshware Hills, Kumaraswamy Layout, Banashankari, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560078
          },
          {
            name: "Sagar Hospital & Diagnostic Services Pvt.Ltd",
            address:
              "44/54 30Th Cross Tilaknagar, Jayanagar Extn, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560041
          },
          {
            name: "Samprathi Eye Hospital & Squint Centre",
            address:
              "No.111 , Railway Parallel Road, 7Th Cross , Kumara Park West, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560020
          },
          {
            name: "Sarojini Hospital",
            address:
              "39/2 , Yash Avenue 8Th Mile Circle , Nh4 , T.Dasarahalli 'B', Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560057
          },
          {
            name: "Sathya Hospital",
            address:
              "# 45, C Ramiah Layout K'Halli, Kammanahalli, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560084
          },
          {
            name: "Shaker Nursing Home",
            address:
              "# 260, Sampige Road Near 17Th Cross, Malleswaram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560003
          },
          {
            name: "Sharavathi Hospital",
            address:
              "No 1133/F, 30 Feet Service Road R.P.C. Layout Vijayanagar , Vijayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560040
          },
          {
            name: "Shekar Eye Hospital",
            address:
              "No:633 , 100 Feet Ring Road , J.P. Nagar 3Rd Phase , J.P.Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560078
          },
          {
            name: "Shekhar Hospital",
            address:
              "No # 81, Bull Temple Road Bangalore, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560019
          },
          {
            name: "Shirdi Sai Hospital",
            address:
              "519, 2Nd Main Nethravathi Street, Opp. To S.L.K Software, New Bel Road, Devasandra, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560054
          },
          {
            name: "Shushrusha Nursing Home",
            address:
              "B. B. Road, Yelahanka, Near Old Bus Stand, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560064
          },
          {
            name: "Sita Bhateja Speciality Hospital",
            address:
              "8 & 9, O' Shaughnessy Road, Langford Gardens, (Nr. Divyasree Chambers, Hockey Stadium, Shanthinagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560025
          },
          {
            name: "Soukya Hospital",
            address:
              "17, Nti Layout Vidyaramyapura Main Road, Bangalore North, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560097
          },
          {
            name: "Sparsh Hospital ",
            address:
              "No.29 / P2 , Health City , Hosur Road, Bommasandra, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560099
          },
          {
            name: "Sree Lakshmi Hospital",
            address:
              "21St Cross, Kaggadasapura,, C.V. Raman Nagar Post, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560093
          },
          {
            name: "Sri Jayadeva Institute Of Cardiology",
            address:
              "Bannerghatta Road , 9Th Block , Jayanagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560069
          },
          {
            name: "Sri Ram Hospital",
            address:
              "No. 107/2 Nishvasha Centre Opp. Traffic Police Station Old Madras Road, Krishnaraja Puram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560036
          },
          {
            name: "Sri Sai Eye Hospital",
            address:
              "311, 4Th B'Cross Rama Murthy Nagar Main Road, Opp. Petrol Bunk, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560016
          },
          {
            name: "St.John'S Medical College  Hospital",
            address:
              "John Nagara , Sarjapur Road, Koramangala, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560034
          },
          {
            name: "St.Martha'S Hospital",
            address: "#05, Nrupathunga Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560001
          },
          {
            name: "Subbiah Hospital",
            address: "No 31, M.S.Ramiah Road, Mathikere, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560054
          },
          {
            name: "Suguna Hospital",
            address:
              "1A/87 , Dr.Rajkumar Road , 4Th N Block, Rajajinagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560010
          },
          {
            name: "Sukruthi Eye Care Hospital",
            address:
              "148, Vyalikaval, Malleswaram 9Th Cross, Malleshwaram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560003
          },
          {
            name: "Sumathi Nursing Home",
            address:
              "No. 426/12 , 2Nd Cross , Mathikere Layout, Mathikere, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560054
          },
          {
            name: "Sundar Hospital",
            address:
              "1 & 2, Hennur Road Cross, Lingarajapuram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560084
          },
          {
            name: "The Apollo Clinic & Daycare Center",
            address:
              "60/3 Konappana Agrahara, Electronic City, Bangalore, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560100
          },
          {
            name: "The Bangalore Hospital",
            address: "# 202, R.V.Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560004
          },
          {
            name: "Trinity Hospital & Heart Foundation",
            address:
              "Near Rv Teacher'S College Area, Basavanagudi, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560004
          },
          {
            name: "Trupti Nursing Home",
            address:
              "# 463 , 1St Block Iii Stage , Dr.S.Puranika Road, Basweshwar Nagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560079
          },
          {
            name: "Udhbhava Hospital",
            address:
              "114,100 Feet Ring Road,Banashankari 3Rd Stage,, Kattarehuppr, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560085
          },
          {
            name: "V.S.Speciality Medical Centre",
            address:
              "196, 10Th Cross , Wilson Gardens, Opp. To Hombe Gowda High School, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560027
          },
          {
            name: "Venkatesh Hospital ",
            address: "#506,Ashwayhkatte Road, V.V.Puram, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560004
          },
          {
            name: "Venlakh Hospital",
            address:
              "No. 123, 5Th Main, Chamrajpet, Chamrjpet, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560018
          },
          {
            name: "Vijai Hospital",
            address:
              "2Nd Cross, 1St Main Road, Pal Layout, Old Madras Road, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560016
          },
          {
            name: "BGS Gleneagles Global Hospitals",
            address:
              "#46, 17Th Cross , Near  Main Bus Stand., Mc Road , Vijaynagar, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560040
          },
          {
            name: "Vinayaka Hospital",
            address:
              "110, 1St Main, Sbm Colony, Banashankari, 1St Stage, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560050
          },
          {
            name: "Vivus/Bhagwan Mahaveer Jain Heart Centre",
            address: "Millers Road , Bangalore, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560079
          },
          {
            name: "Vydehi Institute Of Medical Science & Research Centre",
            address:
              "# 82, Epip Area, Whitefield, Whitefield, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560066
          },
          {
            name: "Wockhardt Hospitals",
            address:
              "#23 , 80 Feet Road Gurukrupa Layout, Opp. Kalavathi Kalyan Mandapam, Nagarbhavi , 2Nd Stage, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560072
          },
          {
            name: "Yogananda Medical & Research Centre",
            address:
              "# 277, M.K. Puttalin Gaian Road, Padanabhnagar,, Bangalore, Karnataka",
            city: "Bangalore",
            state: "Karnataka",
            pin: 560070
          }
        ],
        Aegon_Religare: [
          {
            name: "Sri Srinivasa Hospital",
            address:
              "Ram Temple Street Gandhi Square   New Pet  Opp. Sri Ram Temple",
            city: "Anekal",
            state: "Karnataka",
            pin: "562106"
          },
          {
            name: "Kerudi Hospital & Research Centre",
            address: "Extension Area   Bagalkot  Opp. Axis Bank",
            city: "Bagalkot",
            state: "Karnataka",
            pin: "587101"
          },
          {
            name: "Vittal Eye Hospital",
            address: "Opp. Kerudi Hospital   Bagalkot  Extension Area",
            city: "Bagalkot",
            state: "Karnataka",
            pin: "587101"
          },
          {
            name: "Aadhar Hospital",
            address:
              "Maratha Mandal Compound Chavat Galli   Belgaum City  Court Street",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name: "Shri Sai Hospital",
            address: "40/2   Vadgaon  Laxmi Nagar Main Road",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590005"
          },
          {
            name: "Bhs Lakeview Hospital",
            address: "R.S No-73/7 Cts No.11888    Gandhi Nagar  Opp Fort Lake",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590016"
          },
          {
            name: "Vasan Eye Care Hospital",
            address:
              "3413 G1 Ananth Plaza Samadevi Galli   Belgaum H.O  Opposite Saraswat Bank",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name: "Deccan Medical Centre Pvt Ltd",
            address:
              "C.T.S.5563 Near Railway Over Bridge   Belgaum H.O  Goods Shed Road",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name: "Belgaum Cancer Hospital Pvt. Ltd.",
            address: "N0.9666A 2/D   Ashok Nagar  Ashok Nagar",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590010"
          },
          {
            name: "Dr Bagewadis Eye & Dental Care Centre",
            address: "1354  Basvan Lane  Near Ramling Khind",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590002"
          },
          {
            name: "Netradarshan Super Specialty Eye Hospital",
            address:
              "Cts No.2678/2679   Tilakwadi  Khanapur Road Opp.Big Bazaar",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590006"
          },
          {
            name: "Kasbekar Metgud Clinic",
            address: "Shivaji Nagar   Shivaji Nagar",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590016"
          },
          {
            name: "Citi Hospital",
            address: "Near Lic Office   Hospet  Dam Road",
            city: "Bellary",
            state: "Karnataka",
            pin: "583203"
          },
          {
            name: "Dipali Hospital",
            address:
              "1St Main 8Th Cross   Hospet  Badavane College Road Basaweshwar",
            city: "Bellary",
            state: "Karnataka",
            pin: "583201"
          },
          {
            name: "Dr. Kulkarni Eye Hospital",
            address: "Gopal Swamy (Moka) Road   Bellary  Gandhi Nagar",
            city: "Bellary",
            state: "Karnataka",
            pin: "583103"
          },
          {
            name: "Arunodaya Hospital",
            address: "Havambavi   Havambavi  Siruguppa Road",
            city: "Bellary",
            state: "Karnataka",
            pin: "583101"
          },
          {
            name: "Maithri Hospital",
            address:
              "29Th Ward  Beside Lic Office   Hospet  Sai Complex  Door No. 1170-B M.J Nagar",
            city: "Bellary",
            state: "Karnataka",
            pin: "583203"
          },
          {
            name: "Dr S.K.Panduranga Rao Hospital",
            address: "3Rd Cross Satyanarayana Pet   Bellary City",
            city: "Bellary",
            state: "Karnataka",
            pin: "583101"
          },
          {
            name: "Sripathi Hospital",
            address: "Station Road   Hospet  Opp.State Bank Of India",
            city: "Bellary",
            state: "Karnataka",
            pin: "583201"
          },
          {
            name: "Madhuri Nursing Home",
            address: "434 Moka Road   Bellary Gandhinagar",
            city: "Bellary",
            state: "Karnataka",
            pin: "583103"
          },
          {
            name: "Jyothi Hospital",
            address: "Laila Post And  Village   Belthangady",
            city: "Belthangady",
            state: "Karnataka",
            pin: "574214"
          },
          {
            name: "Parimala Health Care Service",
            address: "Bilekalli   Bannerghatta Road",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560076"
          },
          {
            name: "Manipal Hospital",
            address: "No.98 Rusthom Bhag   Airport Road  Airport Road",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560017"
          },
          {
            name: "Prabha Eye Clinic And Research Centre",
            address: "504 40Th Cross   Jayanagar West  8Th Block",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560070"
          },
          {
            name: "Vijayanagar Global Hospital",
            address: "No. 46 17Th Cross   Vijayanagar  M N Road",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560040"
          }
        ],
        BAJAJ: [
          {
            name: "Sanjeevini Hospital'S",
            address: "A",
            city: "Anekal",
            state: "Karnataka",
            pin: "562102"
          },
          {
            name: "Sri Srinivasa Hospital - Anekal",
            address: "Sri Ram Temple Street,",
            city: "Anekal",
            state: "Karnataka",
            pin: "562106"
          },
          {
            name: "M/S Somyaji Hospital - Bantwal",
            address: "P.O. Jodumarga, B.C.Rd",
            city: "Bantwal",
            state: "Karnataka",
            pin: "574219"
          },
          {
            name: "Vijaya Hospital - Belgaum",
            address:
              "Behind B.D.Jatti College,Civil Hospital Road,Ayodhya Nagar,",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name: "Vasan Eye Care Hospital-Belgaum",
            address:
              "Ananthplaza Building Opposite Saraswat Bank Samadevigalli,",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name:
              "Kles Dr. Prabhakar Kore Hospital & Medical Research Centre - Belgaun",
            address: "Nehru Nagar",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590010"
          },
          {
            name: "Vijaya Ortho And Trauma Centre-Belgaum",
            address:
              "Civil Hospital Road, Ayodhya Nagar, Behind B D Jatti College",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590001"
          },
          {
            name: "Bhs Lakeview Hospital - Belgaum",
            address:
              "Rs. No. 73/7, Cts No.11888, Opp. Fort Lake., Gandhi Nagar, Begaum",
            city: "Belgaum",
            state: "Karnataka",
            pin: "590016"
          },
          {
            name: "Dr.Kulkarni Eye Hospital - Bellary",
            address: "Gopal Swamy Road,",
            city: "Bellary",
            state: "Karnataka",
            pin: "583103"
          },
          {
            name: "Bks Hospital - Bellary",
            address: "No 8,First Cross",
            city: "Bellary",
            state: "Karnataka",
            pin: "583103"
          },
          {
            name: "Arunodaya Hospitals - Bellary",
            address: "Sri Nagar Colony,Sriuguppa Road,Havambavi,",
            city: "Bellary",
            state: "Karnataka",
            pin: "583103"
          },
          {
            name: "Jindal Sanjeevani Hospital - Bellary",
            address: "Vijaya Vittal Nagar(P.O)Toranagallu,Bellary,Karnataka",
            city: "Bellary",
            state: "Karnataka",
            pin: "583275"
          },
          {
            name:
              "Motherhood Hospital ( A Unit Of Rhea Healthcare Pvt Ltd)-Sahakara Nagar",
            address:
              "#2266/17 & 18,Service Road G Block,Sahakara Nagar,Bangalore",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560092"
          },
          {
            name: "Sahaya Holistic Integrative Hospital Pvt.Ltd - Bengaluru",
            address:
              "3Rd Floor, Mahabodhi Mallige Hospital, 1St Block, Jayanagar",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560011"
          },
          {
            name: "Dharma Kidney Care And Research Pvt Ltd - Bangalore",
            address: "909,47Th Cross, Jayanagar 5Th Block",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560041"
          },
          {
            name: "Cratis Hospital-Bangalore",
            address: "No.4, Hennur Main Road, Geddalahalli",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560077"
          },
          {
            name: "Medi-Derma Hospital - Bangalore",
            address: "No-85,Byrathi,Bairathi,Hennur Main Road",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560077"
          },
          {
            name: "Shekar Eye Hospital",
            address: "# 633, 100 Feet Ring Road, 3Rd Phase, J. P. Nagar",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560078"
          },
          {
            name: "Manipal Hospital, Bangalore",
            address: "# 98, Rustom Bagh, Airport Road, Opp Leela Palace,",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560017"
          },
          {
            name:
              "Navachethana Hospital (Unit Of Pan Asia Hospital )-Bangalore",
            address: "No-Ca17/A2, A-Sector, Opp, Rail Wheel Factory,",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560064"
          },
          {
            name: "Columbia Asia Hospital Pvt Ltd,Whitefield - Bangalore",
            address:
              "Sy. No. 10P & 12P, Ramagondanahalli Village, Varthur Hobli, Whitefield,Opposite Forum Value Mall,",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560096"
          },
          {
            name: "Sudarshana Netralaya - Bangalore",
            address:
              "412 Rs Plaza, B/W 6Th 7 7Th Cross, Sampige Road, Malleshwaram",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560003"
          },
          {
            name: "Fortis Hospital - Bangalore",
            address:
              "# 65, 1St Main Road, Near Commercial Tax Office, Seshadripuram",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560020"
          },
          {
            name: "Prasad Eye Hospital",
            address: "#11, Krishna Nagar Industrial Layout,",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560029"
          },
          {
            name: "Dr. Zamindars Microsurgical Eye Centre",
            address:
              "No 1013,1St Block,3Rd Cross,Hrbr Layout,Banaswadi 100Ft Road",
            city: "Bengaluru",
            state: "Karnataka",
            pin: "560043"
          }
        ]
      };

      const POLY = [100, 103];

      const hospitalIn = "Manipal";

      const targetPolicies = POLICIES.filter(policy =>
        POLY.includes(policy.id)
      );

      const validPolicies = targetPolicies.filter(policy => {
        return (
          policy.illness.filter(name =>
            name.toLowerCase().includes(diseaseIn.toLowerCase())
          ).length > 0
        );
      });

      let results = [];

      validPolicies.forEach(
        policy => (results = [...results, ...SUPPLIERS[policy.E2ESupplier]])
      );

      await step.context.sendActivity({
        attachments: [this.createAdaptiveCard(results)]
      });

      return await step.endDialog();
    });
  }

  createAdaptiveCard(results) {
    let struct = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.0",
      type: "AdaptiveCard",
      speak:
        "Your flight is confirmed for you and 3 other passengers from San Francisco to Amsterdam on Friday, October 10 8:30 AM"
    };

    const body = [];
    results.forEach(result => {
      body.push({
        type: "TextBlock",
        text: result.name,
        weight: "bolder",
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.address,
        wrap: true,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.city,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.state,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.pin,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: "",
        isSubtle: false
      });
    });
    struct.body = body;

    console.log(struct);

    return CardFactory.adaptiveCard(struct);
  }
}

module.exports.SearchDialog = SearchDialog;
module.exports.SEARCH_DIALOG = SEARCH_DIALOG;
