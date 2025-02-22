#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <vector>
#include <algorithm>
#include <ctime>
#include <chrono>

using namespace std;

class Room {
public:
    int roomNumber;
    string roomType;
    double pricePerNight;
    bool isAvailable;

    Room(int num = 0, string type = "", double price = 0.0, bool available = true)
        : roomNumber(num), roomType(type), pricePerNight(price), isAvailable(available) {}
};

class Booking {
public:
    int roomNumber;
    string clientName;
    string clientPhone;
    string checkInDate;
    string checkOutDate;
    double totalAmount;
    string paymentMethod;
    string paymentDetails;

    Booking() : roomNumber(0), totalAmount(0.0) {}
};

vector<Room> rooms;
vector<Booking> bookings;

void adminMenu();
void clientMenu();
bool adminLogin();
void viewRooms();
void deleteRoom();
void bookRoom();
void viewBookings();
void checkAvailability();
void loadRooms();
void saveBookingToFile(const Booking&);
void loadBookingsFromFile();
void processPayment(Booking& booking);
void showRoomPrices();
bool isRoomBooked(int roomNumber);
int calculateDaysBetweenDates(const string& checkInDate, const string& checkOutDate);
double calculateTotalCost(int roomNumber, int numberOfDays);

int main() {
    loadRooms();
    loadBookingsFromFile();

    int choice;
    do {
        system("cls");
        cout << "\n===== Hotel Management System =====" << endl;
        cout << "1. Admin Menu" << endl;
        cout << "2. Client Menu" << endl;
        cout << "3. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                if (adminLogin()) {
                    adminMenu();
                }
                break;
            case 2:
                clientMenu();
                break;
            case 3:
                cout << "Exiting... Thank you!" << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 3);

    return 0;
}

bool adminLogin() {
    system("cls");
    string username, password;
    const string adminUsername = "admin";
    const string adminPassword = "123";

    cout << "\n===== Admin Login =====" << endl;
    cout << "Enter Username: ";
    cin >> username;
    cout << "Enter Password: ";
    cin >> password;

    if (username == adminUsername && password == adminPassword) {
        cout << "Login Successful!" << endl;
        system("pause");
        return true;
    } else {
        cout << "Invalid Credentials! Access Denied." << endl;
        system("pause");
        return false;
    }
}

void adminMenu() {
    int choice;
    do {
        system("cls");
        cout << "\n===== Admin Menu =====" << endl;
        cout << "1. View Rooms" << endl;
        cout << "2. Delete Room" << endl;
        cout << "3. View Bookings" << endl;
        cout << "4. Back to Main Menu" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                viewRooms();
                break;
            case 2:
                deleteRoom();
                break;
            case 3:
                viewBookings();
                break;
            case 4:
                return;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 4);
}

void clientMenu() {
    int choice;
    do {
        system("cls");
        cout << "\n===== Client Menu =====" << endl;
        cout << "1. Check Room Availability" << endl;
        cout << "2. View Room Prices" << endl;
        cout << "3. Book a Room" << endl;
        cout << "4. Back to Main Menu" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                checkAvailability();
                break;
            case 2:
                showRoomPrices();
                break;
            case 3:
                bookRoom();
                break;
            case 4:
                return;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 4);
}

void loadRooms() {
    double prices[] = {100.0, 150.0, 250.0};
    string types[] = {"Single", "Double", "Suite"};

    for (int i = 0; i < 100; i++) {
        rooms.push_back(Room(i + 1, types[0], prices[0]));
        rooms.push_back(Room(101 + i, types[1], prices[1]));
        rooms.push_back(Room(201 + i, types[2], prices[2]));
    }
}

void showRoomPrices() {
    cout << "\n===== Room Prices =====" << endl;
    cout << "Single Room: $100 per night" << endl;
    cout << "Double Room: $150 per night" << endl;
    cout << "Suite Room: $250 per night" << endl;
    system("pause");
}

void viewRooms() {
    vector<int> singleRooms, doubleRooms, suiteRooms;

    for (const auto& room : rooms) {
        if (room.roomType == "Single") {
            singleRooms.push_back(room.roomNumber);
        } else if (room.roomType == "Double") {
            doubleRooms.push_back(room.roomNumber);
        } else if (room.roomType == "Suite") {
            suiteRooms.push_back(room.roomNumber);
        }
    }

    cout << "\n===== Room List =====" << endl;
    cout << setw(20) << "\t\tSingle Rooms" << setw(20) << "\t\tDouble Rooms" << setw(20) << "\t\tSuite Rooms" << endl;
    cout << endl;
    size_t maxRows = max({singleRooms.size(), doubleRooms.size(), suiteRooms.size()});

    for (size_t i = 0; i < maxRows; ++i) {
        if (i < singleRooms.size()) {
            cout << setw(20) << (singleRooms[i]) << (isRoomBooked(singleRooms[i]) ? "- Booked" : " - Available");
        } else {
            cout << setw(20) << "";
        }

        if (i < doubleRooms.size()) {
            cout << setw(20) << (doubleRooms[i]) << (isRoomBooked(doubleRooms[i]) ? "-Booked" : " - Available");
        } else {
            cout << setw(20) << "";
        }

        if (i < suiteRooms.size()) {
            cout << setw(20) << (suiteRooms[i]) << (isRoomBooked(suiteRooms[i]) ? " - Booked" : " - Available");
        } else {
            cout << setw(20) << "";
        }

        cout << endl;
    }

    cout << endl;
    system("pause");
}

bool isRoomBooked(int roomNumber) {
    for (const auto& booking : bookings) {
        if (booking.roomNumber == roomNumber) {
            return true;
        }
    }
    return false;
}

void deleteRoom() {
    int roomNumber;
    cout << "Enter Room Number to Delete: ";
    cin >> roomNumber;

    auto it = remove_if(rooms.begin(), rooms.end(), [roomNumber](const Room& room) {
        return room.roomNumber == roomNumber;
    });

    if (it != rooms.end()) {
        rooms.erase(it, rooms.end());
        cout << "Room deleted successfully!" << endl;
    } else {
        cout << "Room not found!" << endl;
    }
    system("pause");
}

int calculateDaysBetweenDates(const string& checkInDate, const string& checkOutDate) {
    // Convert string date to tm
    struct tm checkIn = {}, checkOut = {};
    stringstream ssIn(checkInDate), ssOut(checkOutDate);
    ssIn >> get_time(&checkIn, "%Y-%m-%d");
    ssOut >> get_time(&checkOut, "%Y-%m-%d");

    time_t checkInTime = mktime(&checkIn);
    time_t checkOutTime = mktime(&checkOut);

    double diff = difftime(checkOutTime, checkInTime);
    return static_cast<int>(diff / (60 * 60 * 24));
}

double calculateTotalCost(int roomNumber, int numberOfDays) {
    for (const auto& room : rooms) {
        if (room.roomNumber == roomNumber) {
            cout << "Per night : " << room.pricePerNight << endl;
            return room.pricePerNight * numberOfDays;
        }
    }
    return 0;
}

void bookRoom() {
    int roomNumber;
    cout << "Enter Room Number to Book: ";
    cin >> roomNumber;

    for (auto& room : rooms) {
        if (room.roomNumber == roomNumber) {
            if (!room.isAvailable) {
                cout << "Room is already booked." << endl;
                system("pause");
                return;
            }
            Booking booking;
            booking.roomNumber = roomNumber;
            cout << "Enter Client Name: ";
            cin.ignore();
            getline(cin, booking.clientName);
            cout << "Enter Phone: ";
            cin >> booking.clientPhone;
            cout << "Enter Check-In Date (YYYY-MM-DD): ";
            cin >> booking.checkInDate;
            cout << "Enter Check-Out Date (YYYY-MM-DD): ";
            cin >> booking.checkOutDate;

            int days = calculateDaysBetweenDates(booking.checkInDate, booking.checkOutDate);
            if (days <= 0) {
                cout << "Invalid dates. Check-Out must be after Check-In." << endl;
                system("pause");
                return;
            }

            booking.totalAmount = calculateTotalCost(booking.roomNumber, days);
            cout << "Total day " << days << endl;
            cout << "Total Amount for your stay: $" << booking.totalAmount << endl;

            processPayment(booking);

            room.isAvailable = false;
            bookings.push_back(booking);
            saveBookingToFile(booking);
            cout << "Room booked successfully!" << endl;
            system("pause");
            return;
        }
    }
    cout << "Room not found!" << endl;
    system("pause");
}

void viewBookings() {
    cout << "\n===== Booking List =====" << endl;
    for (const auto& booking : bookings) {
        cout << "Room " << booking.roomNumber << ", Client: " << booking.clientName << ", Phone: " << booking.clientPhone << endl;
    }
    system("pause");
}

void checkAvailability() {
    viewRooms();
}

void saveBookingToFile(const Booking& booking) {
    ofstream outFile("bookings.txt", ios::app);
    outFile << booking.roomNumber << "," << booking.clientName << ","
            << booking.clientPhone << "," << booking.checkInDate << ","
            << booking.checkOutDate << "," << booking.totalAmount << ","
            << booking.paymentMethod << "," << booking.paymentDetails << "\n";
    outFile.close();
}

void loadBookingsFromFile() {
    ifstream inFile("bookings.txt");
    if (!inFile) return;
    while (inFile) {
        Booking booking;
        string temp;
        getline(inFile, temp, ',');
        if (temp.empty()) break;
        booking.roomNumber = stoi(temp);
        getline(inFile, booking.clientName, ',');
        getline(inFile, booking.clientPhone, ',');
        getline(inFile, booking.checkInDate, ',');
        getline(inFile, booking.checkOutDate, ',');
        getline(inFile, temp, ',');
        booking.totalAmount = stod(temp);
        getline(inFile, booking.paymentMethod, ',');
        getline(inFile, booking.paymentDetails);
        bookings.push_back(booking);
    }
    inFile.close();
}

void processPayment(Booking& booking) {
    cout << "Enter Payment Method (Cash/Card): ";
    cin >> booking.paymentMethod;
    cout << "Enter Payment Details: ";
    cin.ignore();
    getline(cin, booking.paymentDetails);
}
