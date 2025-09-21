import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";

export default function Loading() {
  return (
    <Modal
      isOpen={true}               // ✅ Always open
      isDismissable={false}       // ✅ Can't dismiss by clicking outside
      isKeyboardDismissDisabled={true} // ✅ Can't dismiss with Esc
      hideCloseButton             // ✅ Removes close (X) button
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 justify-center items-center">
          Please wait......
        </ModalHeader>
        <ModalBody>
          <Spinner color="primary" label="Loading" labelColor="primary" />
        </ModalBody>
        <ModalFooter className="flex justify-center items-center">
          <p className="font-bold">
            Expense <span className="font-light">Tracker</span>
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
