// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedRecChain is AccessControl {

    //ROLES
    bytes32 public constant ADMIN_ROLE= keccak256("ADMIN_ROLE");
    bytes32 public constant HOSPITAL_ROLE= keccak256("HOSPITAL_ROLE");
    bytes32 public constant DOCTOR_ROLE= keccak256("DOCTOR_ROLE");
    bytes32 public constant PATIENT_ROLE= keccak256("PATIENT_ROLE");

    
    // Admin refers to government, It hard coded by us.
    address public Admin = 0xBF525D3225961c1bdA0aeE59f0cAb8a049D6Fb93;
    
    // [_patient][_doctor] = bool
    mapping (address=>mapping (address =>bool)) isAuth;


    struct Hospital
    {
        uint256 id;
        string name;
        address addr;
        string place;
        uint256 phone;

        
    }

    mapping(address=>Hospital) Hospitals;
    address[] public Hospitals_keys;
    

    struct patient
    {

        uint256 id;
        string name;
        string email;
        string National_Addr;
        uint256 National_id;
        uint256 age;
        address PatientAddress;
        uint256 phone;
        string Blood_Type;
        string marital_status;
        string gender;
        address hospital_addr;
        
        record[] Records;
        
    }

    mapping(address=>patient) patients;
    address[] private patients_keys;

    struct doctor{

        uint256 id;
        string name;
        address hospital_addr;
        uint256 phone;
        string email;
        uint256 age;
        string place;
        string Medical_specialty;
        address docAddress;
    
    }

    mapping(address=>doctor) doctors;
    address[] private doctors_keys;


    struct record {

        uint Medical_id;

        string category;
        string patient_name;
        string rec_name;
        string Created_at;
        address patient_addr;
        address doctor_addr;
        string hex_ipfs;  // file, image date
        string notes;
    }

 
    // for Ids
    uint256 Hospital_index;
    uint256 Doctor_index;
    uint256 Patient_index;
    uint256 Record_index;
    uint256 Request_index;
     

    
    constructor() {
         _setupRole(ADMIN_ROLE,Admin);
    }

    // function to know who logg in
     function logg() public view returns(uint  role){
        if(hasRole(ADMIN_ROLE, msg.sender))
        {return 1;}
        else if(hasRole(HOSPITAL_ROLE, msg.sender))
        {return 2;} 
        else if(hasRole(DOCTOR_ROLE, msg.sender))
        {return 3;} 
        else if(hasRole(PATIENT_ROLE, msg.sender))
        {return 4;}
        else
        {return 0;}
     
    }

    //To check the role of who deploye the contract. 
    modifier onlyAdmin(){ 
        require(hasRole(ADMIN_ROLE, msg.sender),"Only superAdmin has permission to do that action");
        _;
    }

    modifier onlyHospital(){
        require(hasRole(HOSPITAL_ROLE, msg.sender), "This account is not Hospital");
        _;
    }
    modifier onlydoctors(){
        require(hasRole(DOCTOR_ROLE, msg.sender), "This account is not Doctor");
        _;
    }
    modifier onlypatient(){
         require(hasRole(PATIENT_ROLE, msg.sender), "This account is not patient");
        _;
    
    }

//////////////////////////////////////

    //Tasks done by Admin (defult exisit)
    //1. add hospital
    //2. delete hospital
    //3. add doctor
    //4. delete doctor
    //5. see all hospital in system
    //6. see all doctors in system


    function addhospital(string memory _name, address _address, string memory _place, uint256 _phone) public onlyAdmin returns(bool success){
        require(!hasRole(HOSPITAL_ROLE, _address), "This hospital is really exisit!! ");
        require(!hasRole(ADMIN_ROLE, _address), "This Account is Admin!! ");
        require(!hasRole(DOCTOR_ROLE, _address), "This Account is Doctor!! ");
        require(!hasRole(PATIENT_ROLE, _address), "This Account is Patient!! ");

         _setupRole(HOSPITAL_ROLE, _address);
        Hospital_index= Hospital_index+1;
        Hospitals[_address]=Hospital(Hospital_index, _name, _address, _place, _phone); 
        Hospitals_keys.push(_address);
        return true;
    }

    function removeitem_hos(address _hosAddress ) public  {
    require(Hospitals_keys.length > 0, "No keys in array");
        for (uint i = 0; i < Hospitals_keys.length; i++) {
            if (keccak256(abi.encodePacked(Hospitals_keys[i])) == keccak256(abi.encodePacked(_hosAddress))) {
                delete Hospitals_keys[i];
                uint lastIndex =Hospitals_keys.length-1;
                address  lastId = Hospitals_keys[lastIndex];
                Hospitals_keys[i]=lastId;
                Hospitals_keys.pop();
                break;
            }
        }
    }

    function removehospital(address _address) public onlyAdmin returns(bool success){
        require(hasRole(HOSPITAL_ROLE, _address), "This hospital is not exisit");
        _revokeRole(HOSPITAL_ROLE,_address);
        delete Hospitals[_address];
        removeitem_hos(_address);
        return true;
    }

    function get_all_hospitals() public view onlyAdmin returns(Hospital[] memory){
        Hospital[] memory hos = new Hospital[](Hospitals_keys.length);
        for (uint256 i = 0; i < Hospitals_keys.length; i++) {
            hos[i] = Hospitals[Hospitals_keys[i]];
        }
        return hos;
    }

  ///////////////

    function addDoctor(string memory _name, address _hospital_addr, uint256  _phone, string memory _email, uint256  _age, string memory _place, string memory _Medical_specialty, address  _docAddress) public onlyAdmin returns(bool success){
        require(!hasRole(DOCTOR_ROLE, _docAddress), "This account already a doctor");
        require(!hasRole(ADMIN_ROLE, _docAddress), "This Account is Admin!! ");
        require(!hasRole(HOSPITAL_ROLE, _docAddress), "This Account is Hospital!! ");
        require(!hasRole(PATIENT_ROLE, _docAddress), "This Account is Patient!! ");
        require(hasRole(HOSPITAL_ROLE, _hospital_addr), "This hospital is really exisit!! ");
        _setupRole(DOCTOR_ROLE, _docAddress);
        Doctor_index= Doctor_index+1;
        doctors[_docAddress]=doctor(Doctor_index, _name, _hospital_addr, _phone,  _email,  _age,  _place,  _Medical_specialty, _docAddress); 
        doctors_keys.push(_docAddress);
        return true;
    }


   function removeitem_doc(address _docAddress ) public {
    require(doctors_keys.length > 0, "No keys in array");
        for (uint i = 0; i < doctors_keys.length; i++) {
            if (keccak256(abi.encodePacked(doctors_keys[i])) == keccak256(abi.encodePacked(_docAddress))) {
                delete doctors_keys[i];
                uint lastIndex =doctors_keys.length-1;
                address  lastId = doctors_keys[lastIndex];
                doctors_keys[i]=lastId;
                doctors_keys.pop();
                break;
            }
        }
    }
    
    function removeDoctor(address _docAddress) public onlyAdmin returns(bool success){
        require(hasRole(DOCTOR_ROLE, _docAddress),"This account not exisit");
        delete doctors[_docAddress];
        _revokeRole(DOCTOR_ROLE,_docAddress);
        removeitem_doc(_docAddress);
        return true;
    }

    function get_all_Doctors() public view  returns(doctor[] memory){
        doctor[] memory doc = new doctor[](doctors_keys.length);
        for (uint256 i = 0; i < doctors_keys.length; i++) {
            doc[i] = doctors[doctors_keys[i]];
        }
        return doc;
    }

    function get_record_number() public view  returns(uint256 i){
        uint256 total;
        for (uint256 a = 0; a < patients_keys.length; a++) {
        total += patients[patients_keys[a]].Records.length;
    }
    return total;
    }

///////////////////////////////////////////

    // Tasks done by Hospitals (sign in )
    //1. add patient
    //2.See his profile
    //3.see all patients
   

   function get_hospita_by_address(address _addr) view public returns(Hospital memory) {
    return (Hospitals[_addr]);
    }

    
       


    function addPatient(string memory _name, string memory _email, string memory _National_Addr, uint256  _National_id, uint256  _age, address _PatientAddress, uint256 _phone, string memory _Blood_Type, string memory _marital_status, string memory _gender) public onlyHospital returns(bool success){
        require(!hasRole(PATIENT_ROLE, _PatientAddress), "This account already a patient");
        require(!hasRole(ADMIN_ROLE, _PatientAddress), "This Account is Admin!! ");
        require(!hasRole(DOCTOR_ROLE, _PatientAddress), "This Account is Doctor!! ");
        require(!hasRole(HOSPITAL_ROLE, _PatientAddress), "This Account is Hospital!! ");
        _setupRole(PATIENT_ROLE, _PatientAddress);
        Patient_index= Patient_index+1;
        patients[_PatientAddress].id=Patient_index;
        patients[_PatientAddress].PatientAddress=_PatientAddress;
        patients[_PatientAddress].name=_name;
        patients[_PatientAddress].email=_email;
        patients[_PatientAddress].National_Addr=_National_Addr;
        patients[_PatientAddress].National_id=_National_id;
        patients[_PatientAddress].age=_age;
        patients[_PatientAddress].phone=_phone;
        patients[_PatientAddress].Blood_Type=_Blood_Type;
        patients[_PatientAddress].marital_status=_marital_status;
        patients[_PatientAddress].gender=_gender;
        patients[_PatientAddress].hospital_addr=msg.sender;

        patients_keys.push(_PatientAddress);
        return true;
    }

    function get_all_Patients() public view returns(patient[] memory){
        patient[] memory pat = new patient[](patients_keys.length);
        for (uint256 i = 0; i < patients_keys.length; i++) {
            pat[i] = patients[patients_keys[i]];
        }
        return pat;
    }

//////////////////////////////////////////////

    // Tasks done by Doctor (sign in)

    // 1. send request to patient
    // 2. see record (has be accepted)
    // 3. add record (has be accepted)
    // 4.view his profile info
    // 5.show requests by id & show their status


    function get_doctor_by_address(address _addr) view public  returns(doctor memory) {
    return (doctors[_addr]);
    }


    
    struct request
    {
        uint id;
        address from_doctor_addr;
        address to_patients_addr;
        uint256 date;
        string patient_name;
        string doctor_name;
    }
      
    request[] public requests;

    function checkRequestExists(address _from_doctor_addr ,address _to_patients_addr) public view returns (bool) {
        for (uint i = 0; i < requests.length; i++) {
            if ( ((requests[i].from_doctor_addr) == (_from_doctor_addr)) && ((requests[i].to_patients_addr)==(_to_patients_addr)) ) {
                return true;
                }
        }
    return false;
    }



    function send_request_Access(address _patient,address _doctor) public returns(bool success) {
        require(hasRole(PATIENT_ROLE, _patient), "The person you are requesting access to is not a Patient");
        require(!checkRequestExists(_doctor,_patient),"already send a request");
        Request_index=Request_index+1;
        patient memory pati = get_patient_by_address(_patient);
        doctor memory doc = get_doctor_by_address(_doctor);
        requests.push(request(Request_index,_doctor,_patient,block.timestamp,pati.name,doc.name));
        return true;
    }

     function get_all_requests() view public returns(request[] memory) {
        //IN JS convert a Unix timestamp to a human-readable
        // const unixTimestamp = date.currentTimestamp();
        // const date = new Date(unixTimestamp * 1000);
        // const humanReadableDate = date.toLocaleString();

        // Also, be handled, cause it show all requests at blockchain NOT whose patient's requests 
        // it will be solved by check
        // for (i=0 ; i<requests.lenght;i++ ){
        // "if (requests.to_patients_addr == accounts[0]){....}" 
        //}
        return (requests);

    }

        
    function addRecord( string memory _category, string  memory _patient_name, string memory _rec_name, string  memory _Created_at, address _patientAddr, address _doctor_addr, string memory _hex_ipfs, string memory _notes) onlydoctors public returns(bool){
        require(hasRole(PATIENT_ROLE, _patientAddr),"This patients is not exisit");
        require(isAuth[_patientAddr][msg.sender],"No permission to add Records");
        require(_doctor_addr == msg.sender, "No permission to this Doctor" );
        Record_index=Record_index+1;
        patients[_patientAddr].Records.push(record(Record_index, _category, _patient_name, _rec_name, _Created_at, _patientAddr, _doctor_addr, _hex_ipfs, _notes));
        return true;
    }

    


    function See_Record_for_Doctor(address _patientAddr)  view public returns(record[] memory){
       require(isAuth[_patientAddr][msg.sender],"No permission to get Records");
        require(hasRole(PATIENT_ROLE, _patientAddr),"This patients is not exisit");
        require(patients[_patientAddr].Records.length>0,"patient record doesn't exist");
        return (patients[_patientAddr].Records);

    }



///////////////////////////////////

    //Tasks done by Patient (sign in)

    //1.view his all records
    //2.accept request sended by doctor
    //3.rejected request sended by doctor
    //4.give permission to doctor bt himself
    //5.see requestes from doctors
    //6.view his profile info



    function get_patient_by_address(address _addr) view public  returns(patient memory) {
    return (patients[_addr]);
    }



     function See_Record_for_Patient()  view public returns(record[] memory){
        require(patients[msg.sender].Records.length > 0,"patient record doesn't exist");
        return (patients[msg.sender].Records);

    }

    function approveAccess(address _doctor) onlypatient  public {   
        require(hasRole(DOCTOR_ROLE, _doctor), "this acount is not a doctor ");
        require((isAuth[msg.sender][_doctor]) == false, "This Request alraedy been Approved!! ");
        isAuth[msg.sender][_doctor] = true;
    }

    function check_approve_Access(address _doctor, address _patient) view onlydoctors public returns(bool ) {
            return(isAuth[_patient][_doctor]);
        }


   function DeleteRequest(address doc, address pat ) public  {
    require(requests.length > 0, "No keys in array");
        for (uint i = 0; i < requests.length; i++) {
            if( (keccak256(abi.encodePacked(requests[i].from_doctor_addr)) == keccak256(abi.encodePacked(doc))) && (keccak256(abi.encodePacked(requests[i].to_patients_addr)) == keccak256(abi.encodePacked(pat)))) {
                delete requests[i];
                uint lastIndex =requests.length-1;
                request memory lastId = requests[lastIndex];
                requests[i]=lastId;
                requests.pop();
                break;
            }
        }
    }



    function rejectAccess(address _doctor) onlypatient public {
        require(hasRole(DOCTOR_ROLE, _doctor), "Doctor does not have the doctor role");
     //   require((isAuth[msg.sender][_doctor]) == true, "This Request alraedy been Reject!! ");
        isAuth[msg.sender][_doctor] = false;
        DeleteRequest(_doctor,msg.sender);
    }

   

}