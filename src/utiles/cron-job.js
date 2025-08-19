import Booking from "../DB/models/booking.model.js";

export const deleteallBookingCancel = async () => {
  await Booking.destroy({
    where: { process: "cancel" },
  });
};
