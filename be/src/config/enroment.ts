const getDeadlineStatus = (enrollment: any) => {
    const now = new Date();
    if (enrollment.status === "Approved") return "Paid";
    if (enrollment.status === "CancelledByStudent" || enrollment.status === "Cancel") return "Cancelled";
    
    if (enrollment.dueDate < now) return "Overdue";  
    if ((enrollment.dueDate.getTime() - now.getTime()) / (1000*60*60*24) <= 2) return "AlmostDue"; // sắp đến hạn
    return "Pending";
  };
  