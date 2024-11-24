const {
  getByEmailOrPhone,
  createNewRecord,
  getByEmailandPhone,
  getEmailsFromContact,
  getPhonesFromContact,
  updateContact,
  getContactsByLinkedId,
} = require("../queries/Query");

const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ error: "email or phoneNumber must be provided" });
  }

  try {
    const existingRecordByOr = await getByEmailOrPhone(email, phoneNumber);
    const existingRecordByAnd = await getByEmailandPhone(email, phoneNumber);

    const allEmails = await getEmailsFromContact(email);
    const allPhoneNumbers = await getPhonesFromContact(phoneNumber);

    if (existingRecordByOr.length === 0) {
      const newId = await createNewRecord(email, phoneNumber);
      return res.status(200).json({
        contact: {
          primaryContactId: newId,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      });
    }

    if (existingRecordByAnd.length === 0) {
      let primaryRow = existingRecordByOr[0];
      let primaryId = primaryRow.linkedId ? primaryRow.linkedId : primaryRow.id;

      if (allEmails.length === 0 || allPhoneNumbers.length === 0) {
        await createNewRecord(email, phoneNumber, primaryId, "secondary");
      }
    }

    let primaryIds = new Set();
    for (let i = 0; i < existingRecordByOr.length; i++) {
      if (existingRecordByOr[i].linkedId) {
        primaryIds.add(existingRecordByOr[i].linkedId);
      } else {
        primaryIds.add(existingRecordByOr[i].id);
      }
    }

    let allPrimary = [...primaryIds];
    allPrimary.sort((a, b) => a - b);

    const realPrimaryId = allPrimary[0];
    const fakePrimaryId = allPrimary[1];

    if (!realPrimaryId || !fakePrimaryId) {
      const resultEmails = new Set();
      const resultPhoneNumbers = new Set();
      const resultSecondaryContactIds = [];

      const allRecords = await getContactsByLinkedId(realPrimaryId);
      allRecords.forEach((contact) => {
        if (contact.email) resultEmails.add(contact.email);
        if (contact.phoneNumber) resultPhoneNumbers.add(contact.phoneNumber);
        if (contact.linkPrecedence === "secondary") {
          resultSecondaryContactIds.push(contact.id);
        }
      });

      res.status(200).json({
        contact: {
          primaryContactId: realPrimaryId,
          emails: [...resultEmails],
          phoneNumbers: [...resultPhoneNumbers],
          secondaryContactIds: resultSecondaryContactIds,
        },
      });
    } else {
      await updateContact(
        { id: fakePrimaryId },
        { linkedId: realPrimaryId, linkPrecedence: "secondary" }
      );
      await updateContact(
        { linkedId: fakePrimaryId },
        { linkedId: realPrimaryId }
      );
      const resultEmails = new Set();
      const resultPhoneNumbers = new Set();
      const resultSecondaryContactIds = [];

      const allRecords = await getContactsByLinkedId(realPrimaryId);
      allRecords.forEach((contact) => {
        if (contact.email) resultEmails.add(contact.email);
        if (contact.phoneNumber) resultPhoneNumbers.add(contact.phoneNumber);
        if (contact.linkPrecedence === "secondary") {
          resultSecondaryContactIds.push(contact.id);
        }
      });

      res.status(200).json({
        contact: {
          primaryContactId: realPrimaryId,
          emails: [...resultEmails],
          phoneNumbers: [...resultPhoneNumbers],
          secondaryContactIds: resultSecondaryContactIds,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = identifyContact;
