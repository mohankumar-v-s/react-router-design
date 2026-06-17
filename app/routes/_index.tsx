

//#region Interfaces
interface UserDetails {
  EmailAddress: string;
  ContactName: string;
  Password: string;
}
//#endregion

function HomePage() {

  //#region 
  const initialUserState = {
    EmailAddress: "",
    ContactName: "",
    Password: ""
  }
  //#endregion

  //#region Sate Initialization
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserState)
  // Error State
  const [userErrorDetails, setUserErrorDetails] = useState<Record<string, string>>({})
  //#endregion

  //#region Handle On Change
  const handleOnChange = (event: any) => {
    const { name, value } = event.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }
  //#endregion

  //#region Update Validation Error
  const updateErrorByName = (name: string, value: any) => {
    setUserErrorDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  //#endregion

  //#region 
  const addValidationError = (event: any) => {
    const { name, value } = event.target;
    let error = "";

    switch (name) {
      case "EmailAddress":
        error = requiredValidation("Email", value)
        updateErrorByName("EmailAddress", error)
        break;
      case "ContactName":
        error = requiredValidation("Contact Name", value)
        updateErrorByName(name, error)
        break;
    }
    return error;
  }
  //#endregion

  //#region Remove Validation Error
  const removeValidationError = (e: any) => {
    updateErrorByName(e.target.name, "")
  }
  //#endregion

  //#region 
  const validateUserData = () => {
    let error: any = {};

    let emailAddressError = requiredValidation("Email", userDetails?.EmailAddress)
    if (emailAddressError !== "") {
      error.EmailAddress = emailAddressError
    }

    let contactNameError = requiredValidation("Contact Name", userDetails?.ContactName)
    if (contactNameError !== "") {
      error.ContactName = contactNameError
    }

    return error;
  }
  //#endregion

  //#region Handle Submit Functionality
  const handleSubmit = () => {

    const validationError: any = validateUserData()

    if (Object.entries(validationError).length > 0) {
      setUserErrorDetails(validationError)
      console.log("Error Occured")
      return;
    } else {
      handleSaveLogic()
    }

  }
  //#endregion

  //#region Handle Save Logic
  const handleSaveLogic = () => {
    alert(`Submited Data: ${userDetails}`,)
  }
  //#endregion

  //#region Email Validation
  const requiredValidation = (name: string, value: string) => {
    let errorMessage = "";
    if (value == "" || value == undefined || value == null) {
      errorMessage = `${name} required`
    }
    return errorMessage;
  }
  //#endregion

  //#region 

  //#endregion

  return (
    <div>
      <div>
        <label>EmailAddress</label>
        <Input
          id="idEmailAddress"
          name="EmailAddress"
          value={userDetails?.EmailAddress}
          onChange={handleOnChange}
          onBlur={addValidationError}
          onFocus={removeValidationError}
          isInvalid={!!userErrorDetails?.EmailAddress}
          errorMessage={userErrorDetails?.EmailAddress}
        />
      </div>
      <div>
        <label>ContactName</label>
        <Input
          id="idContactName"
          name="ContactName"
          value={userDetails?.ContactName}
          onChange={handleOnChange}
          onBlur={addValidationError}
          onFocus={removeValidationError}
          isInvalid={!!userErrorDetails?.ContactName}
          errorMessage={userErrorDetails?.ContactName}
        />
      </div>
      <div>
        <label>Password</label>
        <Input
          id="idPassword"
          name="Password"
          value={userDetails?.Password}
          onChange={handleOnChange}
          isInvalid={!!userErrorDetails?.Password}
          errorMessage={userErrorDetails?.Password}
        />
      </div>
      <div>
        <Button onPress={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}

export default HomePage