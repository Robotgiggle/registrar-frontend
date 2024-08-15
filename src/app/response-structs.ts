export interface SearchEntry {
    [key: string]: string;
    
    lifetimeid: string;
    uni: string;
    cnumber: string;
    lname: string;
    fname: string;
    gradyear: string;
    status: string;
    tnumber: string;
    eterm: string;
    program: string;
    cluster: string;
}

export interface StudentAddress {
    uni: string,
    address_type: string,
    address_type_desc: string,
    effective_address_date: string,
    end_address_date: string,
    isGoodAddress: string,
    address1: string,
    address2: string|null,
    city_name: string,
    state_code: string,
    zip_code: string,
    Country: string|null,
    day_telephone: string|null,
    day_tel_ext: string|null,
    night_telephone: string|null,
    night_tel_ext: string|null,
    sis_last_mod_date: string
}

export interface StudentComment {
    uni: string,
    Originator: string,
    Comment: string,
    Comment_Date: Date
}

export interface StudentInfo {
    // whether the current session user can edit this record
    can_edit: boolean,
    // actual record information
    uni: string,
    status: string,
    program: string,
    dob: string,
    countryresidency: string,
    visa_code: string|null,
    prefix: string|null,
    fname: string,
    mname: string,
    lname: string,
    email_address: string,
    hphone: string,
    gender: string,
    wphone: string|null,
    tnumber: string,
    gradyear: string,
    entryterm: string,
    cluster: string|null,
    cnumber: string,
    flag_1: number|null,
    visa_status: string|null,
    citizenship: string,
    namepronoun: string|null,
    sis_last_name: string,
    sis_first_name: string,
    sis_m_name: string,
    lifetimeid: string,
    division: string|null,
    preferred_name: string,
    preferred_fname: string,
    preferred_mname: string,
    preferred_lname: string,
    p_date_updated: Date,
    date_updated?: Date,
    source_updated?: string|null,
    last_updated_by?: string|null,
    gdate: Date|null,
    min_gdate: Date|null,
    visa_code_description: string|null,
    lteam: string|null,
    profilephotoURL: string,
    addresses?: StudentAddress[],
    comments?: StudentComment[],
}

export interface HistoryEntry {
    uni: string,
    action: string,
    action_time: Date,
    updated_by: string
}